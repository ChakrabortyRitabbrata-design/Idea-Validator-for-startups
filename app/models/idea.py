from pydantic import BaseModel, ConfigDict

class StartupIdea(BaseModel):
    # This line tells Pydantic 2.0 to be okay with Python 3.14
    model_config = ConfigDict(protected_namespaces=())
    title: str
    description: str

class EvaluationReport(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    idea_summary: str
    market_analysis: str
    competition: str
    feasibility: str
    risks: str
    final_verdict: str