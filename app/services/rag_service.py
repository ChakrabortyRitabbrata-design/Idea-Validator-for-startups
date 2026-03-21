import os
import json
from google import genai
from tavily import TavilyClient # New Import
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize Clients
# Ensure TAVILY_API_KEY is in your Render/Local .env
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def get_live_market_context(title, description):
    """
    REPLACES local file reading. 
    Uses Tavily to find live competitors and market risks.
    """
    query = f"Market competitors and viability risks for a startup: {title} {description}"
    
    # Search the web for the top 3 most relevant results
    search_result = tavily.search(query=query, search_depth="advanced", max_results=3)
    
    # Clean the search results into a single string for Gemini
    context = "\n".join([
        f"Source: {r['url']}\nContent: {r['content']}" 
        for r in search_result['results']
    ])
    return context

def get_ruthless_evaluation(title, description):
    """
    The updated Engine using Live Web Search instead of local data.
    """
    # 2. Get Live Context instead of local data
    live_knowledge = get_live_market_context(title, description)
    
    prompt = f"""
    Analyze this startup idea as a ruthless co-founder and VC.
    
    LIVE MARKET RESEARCH:
    {live_knowledge}
    
    USER IDEA: {title} - {description}
    
    Return ONLY a JSON object with these keys: 
    assumptions, risks (market, execution, competitive), market_type, validation_plan, verdict.
    
    CRITICAL: You MUST mention at least one real competitor found in the research.
    """
    
    try:
        # Use Gemini 1.5 Flash for speed and reliability
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=prompt
        )
        
        # Clean the JSON output
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
        
    except Exception as e:
        return {"error": f"AI Engine Error: {str(e)}"}