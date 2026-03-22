import os
import json
from google import genai
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize Clients
# Pulls keys from your Render/Local Environment Variables
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def get_live_market_context(title, description):
    """
    Uses Tavily to perform Agentic Search for live market data, 
    competitors, and current industry statistics.
    """
    query = f"Current market size, CAGR, and competitors for: {title} {description}"
    
    try:
        # Search the web for high-quality, advanced results
        search_result = tavily.search(query=query, search_depth="advanced", max_results=4)
        
        # Format the snippets for the LLM
        context = "\n".join([
            f"Source: {r['url']}\nContent: {r['content']}" 
            for r in search_result['results']
        ])
        return context
    except Exception as e:
        print(f"Tavily Search Error: {e}")
        return "No live research available at this moment."

def get_ruthless_evaluation(title, description):
    """
    The Strategic Consultant Engine.
    Swaps 'Core Assumptions' for 'Pointwise Strategic Opinions' 
    backed by real-world factual data.
    """
    # 2. Fetch Live Context
    live_knowledge = get_live_market_context(title, description)
    
    # 3. The "Consultant" Prompt
    # Forces Gemini to act as a high-level advisor with pointwise data integration
    prompt = f"""
    You are a Senior Strategic Consultant and Startup Advisor. 
    Analyze the following startup idea using the PROVIDED LIVE MARKET RESEARCH.
    
    LIVE MARKET RESEARCH:
    {live_knowledge}
    
    USER IDEA: 
    TITLE: {title}
    DESCRIPTION: {description}
    
    OUTPUT FORMAT:
    Return ONLY a JSON object with these EXACT keys: 
    "consultant_opinion", "risks", "market_type", "validation_plan", "verdict"

    CONSTRAINTS for 'consultant_opinion':
    - Provide exactly 3-4 powerful, pointwise expert opinions.
    - Each point MUST integrate at least one specific factual data point (e.g., CAGR %, a specific dollar amount, or a named competitor's market share).
    - Use a professional, authoritative tone (e.g., "The data suggests...", "Strategically, the 85% offline retail dependency means...").

    CONSTRAINTS for 'risks':
    - Provide a dictionary with 'market', 'execution', and 'competitive' categories.

    VERDICT:
    - Must be one of: "GO", "NO-GO", or "PIVOT".
    """
    
    try:
        # Using Gemini 1.5 Flash for high-speed analysis
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=prompt
        )
        
        # Clean the Markdown code blocks if Gemini includes them
        raw_text = response.text.strip()
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()
            
        return json.loads(raw_text)
        
    except Exception as e:
        return {
            "error": f"Consultant Engine Error: {str(e)}",
            "consultant_opinion": ["Service is currently recalibrating. Please try again."],
            "verdict": "ERROR"
        }