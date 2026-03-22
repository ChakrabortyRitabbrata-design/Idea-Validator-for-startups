import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Internal Project Imports
from app.db.database import engine, get_db
from app.db import models
from app.models.idea import StartupIdea
from app.services.rag_service import get_ruthless_evaluation # Updated Import Name

# 1. Load Environment Variables
load_dotenv()

# 2. Create Database Tables (Ensure Neon DB is connected)
models.Base.metadata.create_all(bind=engine)

# 3. Initialize FastAPI
app = FastAPI(
    title="AI Startup Advisor Pro",
    description="Agentic RAG system for strategic startup consultation using Gemini & Tavily.",
    version="2.0.0"
)

# 4. Production-Ready CORS Config
# Add your Vercel and Render links here to prevent "Blocked by CORS" errors
origins = [
    "http://localhost:3000",                                # Local Development
    "https://idea-validator-for-startups.vercel.app",       # Main Vercel Production
    "https://idea-validator-for-startups-1.onrender.com",   # Render Backend URL
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
async def health_check():
    """Verify the server is live."""
    return {
        "status": "online", 
        "engine": "Gemini 1.5 Flash", 
        "mode": "Agentic Strategic Consultant"
    }

@app.post("/analyze-idea")
async def analyze_idea(idea: StartupIdea, db: Session = Depends(get_db)):
    """
    Main endpoint: Performs live web-research and returns 
    pointwise strategic opinions.
    """
    try:
        # 1. Trigger the Agentic RAG Pipeline
        # This now returns: consultant_opinion (list), risks, market_type, validation_plan, verdict
        raw_report = get_ruthless_evaluation(idea.title, idea.description)
        
        # 2. Save to Database (Neon PostgreSQL)
        # We store the entire JSON report as a string/text for the history sidebar
        db_evaluation = models.IdeaEvaluation(
            title=idea.title,
            description=idea.description,
            report=str(raw_report) 
        )
        
        db.add(db_evaluation)
        db.commit()
        db.refresh(db_evaluation)
        
        # 3. Return the structured data to the Frontend
        return {
            "id": db_evaluation.id, 
            "analysis": raw_report 
        }

    except Exception as e:
        # Detailed error logging for Render's dashboard
        print(f"CRITICAL ERROR: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Advisor Brain Failure: {str(e)}"
        )

@app.get("/evaluations")
async def get_history(db: Session = Depends(get_db)):
    """Retrieves the history of all validated protocols."""
    try:
        evaluations = db.query(models.IdeaEvaluation).order_by(models.IdeaEvaluation.id.desc()).all()
        return evaluations
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not fetch history from database.")

@app.get("/status")
def get_mode():
    """Simple check to confirm RAG mode."""
    return {"mode": "Web-Search Agentic RAG Enabled"}