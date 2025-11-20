# app/routers/resume.py
from typing import Optional
from fastapi import APIRouter, UploadFile, Form, HTTPException

from app.services.text_extractor import extract_text
from app.services.ai import suggest_improvements, rewrite_resume
from app.schemas.resume import AnalyzeResponse, RewriteResponse, ContactInfo


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
        "original_resume_text": resume_text,
        "summary": ai_suggestions.get("summary", "No summary available"),
        "extracted_skills": ai_suggestions.get("extracted_skills", []),
        "match_score": ai_suggestions.get("match_score", None),
        "improvement_areas": ai_suggestions.get("improvement_areas", []),
        "missing_keywords": ai_suggestions.get("missing_keywords", []),
        "status": "completed"
    }

    return response

@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_resume_for_role(payload: dict):
    """
    Rewrite uploaded resume for a specific job role.
    """
    resume_text = payload.get("resume_text")
    target_role = payload.get("target_role")
    if not resume_text or not target_role:
        raise HTTPException(
            status_code=400,
            detail="resume_text and target_role are required."
        )
    rewritten = rewrite_resume(resume_text, target_role)
    
    contact_info = rewritten.get("contact_info", {})
    
    structured_resume = RewriteResponse(
        contact_info=ContactInfo(
            name=contact_info.get("name", ""),
            phone=contact_info.get("phone", ""),
            email=contact_info.get("email", ""),
            address=contact_info.get("address", ""),
            linkedin=contact_info.get("linkedin", "")
        ),
        summary=rewritten.get("summary", "Summary section could not be extracted."),
        experience=rewritten.get("experience", []),
        education=rewritten.get("education", []),
        skills=rewritten.get("skills", []),
        projects=rewritten.get("projects", []),
        full_text=rewritten.get("full_text", "Rewrite cannot be completed.")
    )
    
    return structured_resume