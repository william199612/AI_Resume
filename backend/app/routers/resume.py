# app/routers/resume.py
from typing import Optional
from fastapi import APIRouter, UploadFile, Form

from app.services.text_extractor import extract_text
from app.services.nlp_processor import analyze_text
from app.services.similarity import compute_similarity
from app.services.ai import suggest_improvements, rewrite_resume


router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
        file: UploadFile,
        job_description: Optional[str] = Form(None),
        use_job_description: bool = Form(False)
    ):
    """
    Analyze uploaded resume, optionally with job description.
    If `use_job_description` is False, analyze resume alone.
    """
    
    # 1. Extract text from resume
    resume_text = extract_text(file)

    # 2. NLP analysis (skills, experience)
    resume_entities = analyze_text(resume_text)

    # 3. Conditional similarity
    ai_suggestions = suggest_improvements(resume_text, job_description or "")
    match_score = None
    
    if use_job_description and job_description:
        match_score = compute_similarity(resume_text, job_description)
    
    response = {
        "resume_summary": resume_entities.get("summary"),
        "extracted_skills": resume_entities.get("skills", []),
        "match_score": round(match_score, 2) if match_score else None,
        "ai_suggestions": ai_suggestions,
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