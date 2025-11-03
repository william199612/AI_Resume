import os
import re
import json
from google import genai

from app.core.logging import logger
from app.utils.file import read_file

client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))


def _safe_json_parse(text: str):
    """
    Cleans Gemini's response and parses it into a JSON dictionary.
    - Removes ``` marks
    - Strips any 'json' or other non-JSON text around it
    - Falls back to line-split if parsing fails
    """
    try:
        # Remove Markdown code fences
        text = re.sub(r"```(?:json)?", "", text, flags=re.IGNORECASE).strip()
        # Parse JSON
        return json.loads(text)
    except Exception:
        # Fallback: split lines and remove bullets
        lines = [l.strip("-• ") for l in text.split("\n") if l.strip()]
        return {"suggestions": lines}


def suggest_improvements(resume_text: str, job_description: str) -> dict:
    """
    Uses Gemini to analyze resume and JD, then return structured suggestions.
    Output format (strict JSON):
    {
        "extracted_skills": [...],
        "missing_keywords": [...],
        "improvement_areas": [...],
        "summary": "...",
        "match_score": 100
    }
    """
    if job_description and job_description.strip():
        prompt = read_file("app/prompts/resume_improve.txt")
        full_prompt = f"""
        {prompt}

        Resume:
        {resume_text}

        Job Description:
        {job_description}
        """
    else:
        # If JD is missing, use a simplified prompt
        prompt = read_file("app/prompts/resume_improve.txt")
        full_prompt = f"""
        {prompt}

        Resume:
        {resume_text}
        """

    try:
        response = client.models.generate_content(
            model=os.getenv("GENAI_MODEL", "gemini-2.5-flash-lite"),
            contents=full_prompt
        )
        return _safe_json_parse(response.text)  # type: ignore
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return {"error": "AI analysis failed, please try again."}


def rewrite_resume(resume_text: str, target_role: str) -> dict:
    """
    Uses Gemini to rewrite the resume for a specific target role.
    Output format (strict JSON):
    {
        "rewritten_resume": "...",
        "added_keywords": [...],
        "summary": "..."
    }
    """

    prompt = read_file("app/prompts/resume_rewrite.txt")
    full_prompt = f"""
    ${prompt}
    
    Resume:
    {resume_text}

    Target Role:
    {target_role}
    """
    
    try:
        response = client.models.generate_content(
            model=os.getenv("GENAI_MODEL", "gemini-2.5-flash-lite"),
            contents=full_prompt
        )
        return _safe_json_parse(response.text)  # type: ignore
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return {"error": "AI analysis failed, please try again."}