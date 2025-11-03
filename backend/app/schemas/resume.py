# app/schemas/resume.py
from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    use_job_description: bool
    job_description: Optional[str] = None

class AnalyzeResponse(BaseModel):
    match_score: float
    extracted_skills: List[str]
    resume_summary: str
    ai_suggestions: dict
