from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

# Internal Imports
from app.db.database import engine, get_db
from app.db import models
from app.models.idea import StartupIdea
from app.services.rag_service import evaluate_startup_idea

# 1. Load Environment Variables
load_dotenv()

# 2. Create Database Tables
models.Base.metadata.create_all(bind=engine)

# 3. Initialize FastAPI
app = FastAPI(
    title="AI Startup Evaluator Pro",
    description="A RAG-powered system to analyze startup viability using Gemini.",
    version="1.0.0"
)

# --- THE BIG FIX: SPECIFIC CORS SETTINGS ---
# Replace the Vercel link below with your ACTUAL production URL
origins = [
    "http://localhost:3000", # Local development
    "https://idea-validator-for-startups.vercel.app", #   Vercel URL 
    "https://idea-validator-for-startups-1.onrender.com", #  Render URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # No more "*" which causes issues with credentials/history
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    """Checks if the server is alive."""
    return {"status": "online", "engine": "Gemini 3 Flash"}

@app.post("/analyze-idea")
async def analyze_idea(idea: StartupIdea, db: Session = Depends(get_db)):
    try:
        # 1. Trigger the Modular Pipeline (Gemini)
        raw_report = evaluate_startup_idea(idea.title, idea.description)
        
        # 2. Extract specific modules for storage
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report=str(raw_report) 
        )
        
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)
        
        return {
            "id": db_evaluation.id, 
            "analysis": raw_report 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/evaluations")
async def get_all_evaluations(db: Session = Depends(get_db)):
    """Retrieves all past evaluations from the database."""
    evaluations = db.query(models.IdeaEvaluation).all()
    return evaluations
