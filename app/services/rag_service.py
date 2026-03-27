import os
import json
import asyncio
import re
from google import genai
from tavily import TavilyClient
from dotenv import load_dotenv
from app.db.vector_store import get_vector_store

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# Add context distiller to strip boilerplate HTML/excessive characters
def distill_context(text):
    # Strip basic HTML tags if any slipped through
    text = re.sub(r'<[^>]+>', '', text)
    # Remove multiple spaces/newlines
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:2000] # Cap length for speed

async def get_live_market_context(title, description):
    query = f"Current market size, CAGR, and competitors for: {title} {description}"
    try:
        # Reduced max_results and search_depth='fast' for 50% lower latency
        search_result = await asyncio.to_thread(tavily.search, query=query, search_depth="fast", max_results=5)
        
        context = "\n".join([
            f"Source: {r['url']}\nContent: {distill_context(r['content'])}" 
            for r in search_result['results']
        ])
        return context
    except Exception as e:
        print(f"Tavily Search Error: {e}")
        return "No live research available at this moment."

async def get_faiss_vector_context(title, description):
    query = f"{title} {description}"
    try:
        store = await asyncio.to_thread(get_vector_store)
        docs = await asyncio.to_thread(store.similarity_search, query, k=3)
        context = "\n".join([f"Internal Doc: {d.page_content}" for d in docs])
        return context
    except Exception as e:
        print(f"FAISS vector search error: {e}")
        return ""

async def get_ruthless_evaluation(title, description):
    # 2. Sequential execution of searches
    live_knowledge = await get_live_market_context(title, description)
    faiss_knowledge = await get_faiss_vector_context(title, description)
    
    combined_knowledge = f"{live_knowledge}\n\n{faiss_knowledge}"
    
    # 3. The "Consultant" Prompt
    prompt = f"""
    You are a Senior Strategic Consultant and Startup Advisor. 
    Analyze the following startup idea using the PROVIDED LIVE MARKET RESEARCH and INTERNAL DOCS.
    
    LIVE MARKET RESEARCH & INTERNAL DOCS:
    {combined_knowledge}
    
    USER IDEA: 
    TITLE: {title}
    DESCRIPTION: {description}
    
    OUTPUT FORMAT:
    Return ONLY a JSON object with these EXACT keys: 
    "consultant_opinion", "risks", "market_type", "validation_plan", "verdict"

    CONSTRAINTS for 'consultant_opinion':
    - Provide exactly 3-4 powerful, pointwise expert opinions.
    - Each point MUST integrate at least one specific factual data point (e.g., CAGR %, a specific dollar amount).
    - Use a professional, authoritative tone.

    CONSTRAINTS for 'risks':
    - Provide a dictionary with 'market', 'execution', and 'competitive' categories.

    VERDICT:
    - Must be one of: "GO", "NO-GO", or "PIVOT".
    """
    
    model_name = "gemini-3-flash-preview"
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name, 
            contents=prompt
        )
        return response.text
    except Exception as e:
        return json.dumps({
            "error": f"Consultant Engine Error: {str(e)}",
            "consultant_opinion": ["Service is currently recalibrating. Please try again."],
            "verdict": "ERROR"
        })