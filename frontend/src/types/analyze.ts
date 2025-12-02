export interface AnalyzeResponse {
    summary: string;
    extracted_skills: string[];
    improvement_areas: string[];
    missing_keywords: string[];
    match_score?: number | null;
    status?: string;
}

export interface ContactInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
    linkedin?: string;
}

export interface ExperienceItem {
    title: string;
    company: string;
    dates: string;
    details: string;
}

export interface EducationItem {
    school: string;
    degree: string;
    dates: string;
    details?: string;
}

export interface SkillCategory {
    technical: string[];
    tools: string[];
    soft_skills: string[];
}

export interface ProjectItem {
    name: string;
    description: string;
    link?: string;
}

export interface RewriteResponse {
    contact_info: ContactInfo;
    summary: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    skills: SkillCategory;
    projects?: ProjectItem[];
}

export interface EditableResumeProps {
    initialData: RewriteResponse;
    onUpdate?: (data: RewriteResponse) => void;
}
