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

from app.services.rag_service import get_ruthless_evaluation
import json
from fastapi.responses import JSONResponse

@app.post("/analyze-idea")
async def analyze_idea(idea: StartupIdea, db: Session = Depends(get_db)):
    """
    Triggers the research agent and returns standard JSON.
    Saves the analysis to PostgreSQL.
    """
    try:
        # 1. Get Evaluation
        full_text = await get_ruthless_evaluation(idea.title, idea.description)

        # 2. Save to DB
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report=full_text
        )
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)

        # 3. Return JSON with ID in headers for frontend compatibility
        # We also include the ID in the response body just in case it's needed
        response_content = {"id": db_evaluation.id, "report": full_text}
        
        return JSONResponse(
            content=response_content,
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

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)