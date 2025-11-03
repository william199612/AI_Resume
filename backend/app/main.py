# app/app.py
import os
import uvicorn
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume


# --- Initialize app ---
app = FastAPI(
    title="Smart Resume Analyzer",
    description="AI-powered resume analysis and job match scoring API",
    version="1.0.0",
)

# --- CORS setup (for optional frontend use) ---
origins = [
    "http://localhost:3000",  # React dev
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(resume.router, prefix="/api", tags=["Resume Analysis"])

# --- Health check ---
@app.get("/")
def root():
    return {"message": "Smart Resume Analyzer API is running 🚀"}

# --- For running directly ---
if __name__ == "__main__":
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
