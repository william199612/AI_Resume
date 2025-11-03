# 🧠 AI Resume Analyzer

**An intelligent resume analysis platform** powered by **Google Gemini**, **FastAPI**, and **Next.js**, designed to help job seekers enhance their resumes and align them with specific job descriptions.

---

## 🚀 Overview

The AI Resume Analyzer allows users to upload their resume (PDF/DOCX) and optionally a job description (JD).  
It then uses AI to:

-   Extract key skills and technical terms from the resume
-   Identify missing or weak skills compared to the JD
-   Suggest areas for improvement
-   Estimate a **match score** between the resume and the job

When no JD is provided, the app still analyzes and improves the resume independently.

---

## 🧩 Features

✅ Upload **PDF or DOCX** resume files  
✅ Optional **Job Description** input  
✅ AI-powered **resume and JD analysis** using Google Gemini  
✅ Provides:

-   Extracted skills
-   Missing keywords
-   Improvement areas
-   Match score (if JD is provided)
-   Summary feedback

✅ Clean **Next.js frontend** with Tailwind UI  
✅ Real-time AI feedback and charts (coming soon in Phase 3)

---

## 🏗️ Tech Stack

| Layer                 | Technology                                          |
| --------------------- | --------------------------------------------------- |
| **Frontend**          | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **Backend**           | FastAPI (Python 3.13)                               |
| **AI Engine**         | Google Gemini API (`google-genai` SDK)              |
| **File Parsing**      | `docx2txt`, `PyPDF2`                                |
| **Data Interchange**  | JSON (REST API)                                     |
| **Development Tools** | ESLint, dotenv, uvicorn, nodemon                    |

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/william199612/ai_resume.git
cd ai_resume
```

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # (Windows)
# or source venv/bin/activate (Mac/Linux)

pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file inside `backend/`:

```bash
GENAI_API_KEY=your_google_gemini_api_key
GENAI_MODEL=gemini-2.5-flash-lite
```

Run the Backend Server

```bash
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

The app will run at:  
👉 Frontend: http://localhost:3000  
👉 Backend: http://localhost:8000

--

## 🧱 API Specification

### **POST** `/api/analyze`

Uploads a resume and optional job description for AI analysis.

---

### 🧾 Request

**Content-Type:** `multipart/form-data`

| Field             | Type   | Required | Description                    |
| ----------------- | ------ | -------- | ------------------------------ |
| `file`            | File   | ✅       | Resume file (`.pdf` / `.docx`) |
| `job_description` | String | ❌       | Job description text           |

---

### 🧩 Response Example

```json
{
    "resume_summary": "Concise summary of resume content.",
    "extracted_skills": ["Python", "AWS", "Node.js"],
    "match_score": 87,
    "ai_suggestions": {
        "missing_keywords": ["Django", "REST APIs"],
        "improvement_areas": ["Add measurable project outcomes"],
        "summary": "Strong technical foundation but missing backend project details."
    },
    "status": "completed"
}
```

--

## 🎨 Frontend Features

-   🗂️ Intuitive upload UI
-   ✍️ Optional Job Description input
-   📊 Dynamic result panel including:
    -   Extracted skills badges
    -   Match score visualization
    -   AI-generated feedback list
-   💻 Fully responsive Tailwind CSS design

--

## 🧭 Roadmap

| Phase | Feature                                     | Status         |
| ----- | ------------------------------------------- | -------------- |
| 1     | Backend with FastAPI + AI integration       | ✅ Completed   |
| 2     | Frontend (Next.js) basic UI                 | ✅ Completed   |
| 3     | Visual feedback (charts, word clouds, etc.) | 🚧 In Progress |
| 4     | Resume rewrite / optimization module        | 🧠 Planned     |
| 5     | User accounts + resume history              | 🗂️ Planned     |

--

## 🛡️ License

This project is licensed under the MIT License — feel free to use, modify, and distribute.
