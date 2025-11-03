# app/services/nlp_processor.py
import spacy

nlp = spacy.load("en_core_web_sm")

def analyze_text(text: str):
    doc = nlp(text)
    skills = []
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "SKILL"]:
            skills.append(ent.text)
    return {
        "skills": list(set(skills)),
        "summary": f"Extracted {len(skills)} relevant skills."
    }
