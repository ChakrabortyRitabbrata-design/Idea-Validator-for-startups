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

# 1. Load Environment Variables (API Keys, DB URLs)
load_dotenv()

# 2. Create Database Tables (The "Idea Vault")
# This tells SQLAlchemy to build the tables if they don't exist yet
models.Base.metadata.create_all(bind=engine)

# 3. Initialize FastAPI
app = FastAPI(
    title="AI Startup Evaluator Pro",
    description="A RAG-powered system to analyze startup viability using Gemini.",
    version="1.0.0"
)

# Configure CORS so the standalone index.html can fetch data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        # We now expect a structured report based on the roadmap's modules
        raw_report = evaluate_startup_idea(idea.title, idea.description)
        
        # 2. Extract specific modules for storage [cite: 82]
        # In a real app, you might save these into separate DB columns
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report=str(raw_report) # Store the full structured analysis
        )
        
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)
        
        return {
            "id": db_evaluation.id, 
            "analysis": raw_report  # Send the full structured object to the frontend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/evaluations")
async def get_all_evaluations(db: Session = Depends(get_db)):
    """Retrieves all past evaluations from the database."""
    evaluations = db.query(models.IdeaEvaluation).all()
    return evaluations