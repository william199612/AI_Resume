# app/routers/resume.py
from typing import Optional
from fastapi import APIRouter, UploadFile, Form

from app.services.text_extractor import extract_text
from app.services.ai import suggest_improvements, rewrite_resume
from app.schemas.resume import AnalyzeResponse


router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
        file: UploadFile,
        job_description: Optional[str] = Form(None)
    ):
    """
    Analyze uploaded resume, optionally with job description.
    If `use_job_description` is False, analyze resume alone.
    """
    
    # 1. Extract text from resume
    resume_text = extract_text(file)

    # 2. Conditional similarity
    ai_suggestions = suggest_improvements(resume_text, job_description or "")
    
    response = {
        "summary": ai_suggestions.get("summary", "No summary available"),
        "extracted_skills": ai_suggestions.get("extracted_skills", []),
        "match_score": ai_suggestions.get("match_score", None),
        "improvement_areas": ai_suggestions.get("improvement_areas", []),
        "missing_keywords": ai_suggestions.get("missing_keywords", []),
        "status": "completed"
    }

    return response


@router.post("/improve")
async def improve_resume(file: UploadFile, job_description: str = Form(...)):
    resume_text = extract_text(file)
    suggestions = suggest_improvements(resume_text, job_description)
    return suggestions


@router.post("/rewrite")
async def rewrite_resume_for_role(file: UploadFile, target_role: str = Form(...)):
    resume_text = extract_text(file)
    rewritten = rewrite_resume(resume_text, target_role)
    return {"target_role": target_role, "rewritten_resume": rewritten}