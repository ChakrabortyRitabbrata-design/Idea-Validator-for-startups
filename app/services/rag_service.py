import os
import json
from google import genai # <--- The new import
from dotenv import load_dotenv

load_dotenv()

# Initialize the new Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def get_context_from_data():
    """Retrieves 'Failure Pattern' data from your local folder[cite: 46, 85]."""
    context = ""
    data_path = "data/"
    if os.path.exists(data_path):
        for filename in os.listdir(data_path):
            if filename.endswith(".txt"):
                with open(os.path.join(data_path, filename), "r") as f:
                    context += f.read() + "\n"
    return context

def evaluate_startup_idea(title, description):
    """The 'Ruthless Co-founder' Engine using the new SDK."""
    knowledge_base = get_context_from_data()
    
    # Roadmap-aligned prompt for Assumption & Risk Extraction [cite: 29, 34]
    prompt = f"""
    Analyze this startup idea as a ruthless co-founder.
    Context from failures: {knowledge_base}
    Idea: {title} - {description}
    
    Return ONLY a JSON object with these keys: 
    assumptions, risks (market, execution, competitive), market_type, validation_plan, verdict.
    """
    
    try:
        # The new call syntax for Gemini 1.5 Flash
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        
        # The new SDK provides a cleaner way to get text
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        return {"error": str(e)}