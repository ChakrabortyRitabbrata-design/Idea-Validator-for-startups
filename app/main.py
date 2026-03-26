import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv

# Internal Project Imports
from app.db.database import engine, get_db
from app.db import models
from app.models.idea import StartupIdea
from app.services.rag_service import get_ruthless_evaluation

# 1. Load Environment Variables
load_dotenv()

# 2. Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

# 3. Initialize FastAPI App
app = FastAPI(
    title="Advisor AI: Strategic Startup Validator",
    description="Agentic RAG system providing real-time market intelligence.",
    version="2.1.0"
)

# 4. Production CORS Configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

@app.get("/")
async def root():
    return {"status": "online", "mode": "Strategic Consultant Agentic RAG"}

from fastapi.responses import StreamingResponse
from app.services.rag_service import get_ruthless_evaluation_stream
from app.services.cache_service import semantic_cache
import json

@app.post("/analyze-idea")
async def analyze_idea(idea: StartupIdea, db: Session = Depends(get_db)):
    """
    Triggers the research agent and returns a stream.
    Saves the analysis to PostgreSQL.
    """
    try:
        # 1. Semantic Cache Check
        cached_report = semantic_cache.check_cache(idea.title, idea.description)
        if cached_report:
            # If hit, we need to fake a stream or return standard JSON. 
            # Since the frontend stream reader will just read all chunks, 
            # we can yield the whole cached string as one chunk.
            
            # Find the ID of the cached report by creating a new evaluation record 
            # (or we could just not create a new one, but user requested saving it)
            db_evaluation = models.IdeaEvaluation(
                title=idea.title,
                description=idea.description,
                report=cached_report
            )
            db.add(db_evaluation)
            db.commit()
            db.refresh(db_evaluation)
            
            async def fake_stream():
                # The frontend expects to parse the string, so we yield it as is.
                # If cached_report is already a string of JSON, yield it.
                yield cached_report
                
            return StreamingResponse(
                fake_stream(), 
                media_type="text/plain", 
                headers={"X-Evaluation-Id": str(db_evaluation.id)}
            )

        # 2. Setup new DB Evaluation to get ID
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report="" # Will be updated after stream
        )
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)

        # 3. Stream and Save
        async def stream_and_save():
            full_text = ""
            async for chunk in get_ruthless_evaluation_stream(idea.title, idea.description):
                full_text += chunk
                yield chunk
            
            # Post-stream update
            # We must get a new DB session since the original scoped one might be closed 
            # after the route returns.
            from app.db.database import SessionLocal
            post_db = SessionLocal()
            try:
                db_eval = post_db.query(models.IdeaEvaluation).filter(models.IdeaEvaluation.id == db_evaluation.id).first()
                if db_eval:
                    db_eval.report = full_text
                    post_db.commit()
                # Update Cache
                semantic_cache.add_to_cache(db_evaluation.id, idea.title, idea.description)
            except Exception as e:
                print(f"Error saving stream to DB: {e}")
            finally:
                post_db.close()

        return StreamingResponse(
            stream_and_save(), 
            media_type="text/plain",
            headers={"X-Evaluation-Id": str(db_evaluation.id)}
        )

    except Exception as e:
        print(f"Deployment Error Log: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis Engine Failure: {str(e)}"
        )

@app.get("/evaluations")
async def get_history(db: Session = Depends(get_db)):
    """Fetch all past startup protocols."""
    try:
        evaluations = db.query(models.IdeaEvaluation).order_by(models.IdeaEvaluation.id.desc()).all()
        # Ensure we return an empty list [] instead of null/None
        return evaluations if evaluations else []
    except Exception as e:
        print(f"Database Error: {e}")
        return [] # Return empty list on error to keep UI stable