export interface AISuggestions {
    missing_keywords?: string[];
    improvement_areas?: string[];
    summary?: string;
}

export interface AnalyzeResponse {
    resume_summary?: string;
    extracted_skills?: string[];
    match_score?: number | null;
    ai_suggestions?: AISuggestions | null;
    status?: string;
}
