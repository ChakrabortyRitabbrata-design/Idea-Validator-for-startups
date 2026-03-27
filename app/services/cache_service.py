import os
import faiss
import numpy as np
from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.db import models
from google import genai
from dotenv import load_dotenv

load_dotenv()

class SemanticCache:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        self.dimension = 768 # text-embedding-004 default dimension
        # Use Inner Product (Cosine similarity when vectors are normalized)
        self.index = faiss.IndexFlatIP(self.dimension)
        self.db_ids = []
        
        self._load_recent()

    def _get_embedding(self, text):
        response = self.client.models.embed_content(
            model="text-embedding-004", 
            contents=text
        )
        return response.embeddings[0].values

    def _load_recent(self):
        db = SessionLocal()
        try:
            twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
            recent_evals = db.query(models.IdeaEvaluation).filter(
                models.IdeaEvaluation.created_at >= twenty_four_hours_ago
            ).all()

            for ev in recent_evals:
                self.add_to_cache(ev.id, ev.title, ev.description)
        except Exception as e:
            print(f"Error loading cache: {e}")
        finally:
            db.close()

    def add_to_cache(self, db_id, title, description):
        text = f"{title} {description}"
        try:
            vector = self._get_embedding(text)
            vector_np = np.array([vector]).astype('float32')
            faiss.normalize_L2(vector_np)
            
            self.index.add(vector_np)
            self.db_ids.append(db_id)
        except Exception as e:
            print(f"Cache Add Error: {e}")

    def check_cache(self, title, description, threshold=0.95):
        if self.index.ntotal == 0:
            return None
            
        text = f"{title} {description}"
        try:
            vector = self._get_embedding(text)
            vector_np = np.array([vector]).astype('float32')
            faiss.normalize_L2(vector_np)
            
            scores, indices = self.index.search(vector_np, 1)
            best_score = scores[0][0]
            best_idx = indices[0][0]
            
            if best_score >= threshold and best_idx != -1:
                matched_db_id = self.db_ids[best_idx]
                db = SessionLocal()
                try:
                    ev = db.query(models.IdeaEvaluation).filter(models.IdeaEvaluation.id == matched_db_id).first()
                    if ev:
                        return ev.report
                finally:
                    db.close()
        except:
            pass
        return None

semantic_cache = SemanticCache()
