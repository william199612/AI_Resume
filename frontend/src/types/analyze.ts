export interface AISuggestions {
    missing_keywords?: string[];
    improvement_areas?: string[];
    summary?: string;
}

export interface AnalyzeResponse {
    summary: string;
    extracted_skills: string[];
    improvement_areas: string[];
    missing_keywords: string[];
    match_score?: number | null;
    status?: string;
}
