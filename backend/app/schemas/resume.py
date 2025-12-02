# app/schemas/resume.py
from pydantic import BaseModel
from typing import Dict, List, Optional

class AnalyzeRequest(BaseModel):
    use_job_description: bool
    job_description: Optional[str] = None

class AnalyzeResponse(BaseModel):
    original_resume_text: str
    match_score: float | None
    extracted_skills: List[str]
    summary: str
    improvement_areas: List[str]
    missing_keywords: List[str]
    status: str

class ContactInfo(BaseModel):
    name: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    address: Optional[str] = ""
    linkedin: Optional[str] = ""

class ExperienceItem(BaseModel):
    title: Optional[str] = ""
    company: Optional[str] = ""
    dates: Optional[str] = ""
    details: Optional[str] = ""

class EducationItem(BaseModel):
    school: Optional[str] = ""
    degree: Optional[str] = ""
    dates: Optional[str] = ""
    details: Optional[str] = ""

class SkillCategory(BaseModel):
    technical: List[str]
    tools: List[str]
    soft_skills: List[str]

class ProjectItem(BaseModel):
    name: Optional[str] = ""
    description: Optional[str] = ""
    link: Optional[str] = ""

class RewriteResponse(BaseModel):
    contact_info: ContactInfo
    summary: str
    experience: List[ExperienceItem]
    education: List[EducationItem]
    skills: SkillCategory
    projects: List[ProjectItem]
    full_text: str
