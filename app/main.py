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
origins = [
    "http://localhost:3000",
    "https://idea-validator-for-startups.vercel.app", 
    "https://idea-validator-for-startups-1.onrender.com"# Replace with your actual Vercel URL
]

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

@app.post("/analyze-idea")
async def analyze_idea(idea: StartupIdea, db: Session = Depends(get_db)):
    """
    Triggers the research agent and saves the analysis to PostgreSQL.
    """
    try:
        # Perform Live Market Research + Gemini Analysis
        report_data = get_ruthless_evaluation(idea.title, idea.description)
        
        # Save to Neon DB
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report=str(report_data) # Saving as string for easy storage
        )
        
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)
        
        # Return BOTH the ID and the Analysis so the frontend can handle resets
        return {
            "id": db_evaluation.id,
            "analysis": report_data
        }

    except Exception as e:
        print(f"Deployment Error Log: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis Engine Failure: {str(e)}"
        )

@app.get("/evaluations")
async def get_history(db: Session = Depends(get_db)):
    """Fetch all past startup protocols."""
    evaluations = db