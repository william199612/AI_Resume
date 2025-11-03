# app/services/similarity.py
from sentence_transformers import SentenceTransformer, util

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')  # load on first request
    return _model

def compute_similarity(resume_text: str, job_description: str):
    model = get_model()
    embeddings = model.encode([resume_text, job_description])
    score = util.cos_sim(embeddings[0], embeddings[1])
    return round(float(score), 2) * 100
