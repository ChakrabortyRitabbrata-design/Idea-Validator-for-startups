import os
import faiss
import numpy as np
from google import genai
from dotenv import load_dotenv

load_dotenv()

class LightweightVectorStore:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        self.dimension = 768
        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.make_direct_map()
        self.documents = []
        self._load()

    def _get_embedding(self, text):
        response = self.client.models.embed_content(
            model="text-embedding-004", 
            contents=text
        )
        return response.embeddings[0].values

    def _load(self):
        if not os.path.exists("data/market_data.txt"):
            return
            
        with open("data/market_data.txt", "r", encoding="utf-8") as f:
            text = f.read()
            
        # Lightweight manual splitting (~500 chars)
        chunks = [text[i:i+500] for i in range(0, len(text), 450)]
        self.documents = chunks
        
        for chunk in chunks:
            vector = self._get_embedding(chunk)
            vector_np = np.array([vector]).astype('float32')
            faiss.normalize_L2(vector_np)
            self.index.add(vector_np)

    def similarity_search(self, query, k=3):
        if self.index.ntotal == 0:
            return []
            
        vector = self._get_embedding(query)
        vector_np = np.array([vector]).astype('float32')
        faiss.normalize_L2(vector_np)
        
        scores, indices = self.index.search(vector_np, k)
        
        class DummyDoc:
            def __init__(self, content):
                self.page_content = content
                
        results = [DummyDoc(self.documents[idx]) for idx in indices[0] if idx != -1]
        return results

_store_instance = None

def get_vector_store():
    global _store_instance
    if _store_instance is None:
        _store_instance = LightweightVectorStore()
    return _store_instance