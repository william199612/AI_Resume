# app/schemas/resume.py
from pydantic import BaseModel
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    use_job_description: bool
    job_description: Optional[str] = None

class AnalyzeResponse(BaseModel):
    match_score: float | None
    extracted_skills: List[str]
    summary: str
    improvement_areas: List[str]
    missing_keywords: List[str]
