"use client";

import { useState, useEffect } from "react";
import { AnalyzeResponse } from "@/types/analyze";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [useJobDescription, setUseJobDescription] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [history, setHistory] = useState<{ ts: number; score: number }[]>([]);

    useEffect(() => {
        const raw = localStorage.getItem("analysis_history");
        if (raw) setHistory(JSON.parse(raw));
    }, []);
    const pushHistory = (score: number | null) => {
        if (score === null || score === undefined) return;
        const entry = { ts: Date.now(), score };
        const next = [...history, entry].slice(-20); // keep last 20
        setHistory(next);
        localStorage.setItem("analysis_history", JSON.stringify(next));
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please upload your resume file.");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("use_job_description", String(useJobDescription));
        if (useJobDescription && jobDescription) {
            formData.append("job_description", jobDescription);
        }

        try {
            setLoading(true);
            const res = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to analyze resume.");
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            alert("Error analyzing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
            <div className="max-w-5xl w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Smart Resume Analyzer
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 w-full max-w-xl mx-auto"
                >
                    {/* --- Upload Resume --- */}
                    <div>
                        <h2 className="block font-medium text-gray-700 mb-2">
                            Upload Resume
                        </h2>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                id="resumeFile"
                                accept=".pdf,.doc,.docx"
                                onChange={handleUpload}
                                className="hidden"
                            />

                            <label
                                htmlFor="resumeFile"
                                className="px-3 py-1.5 border border-gray-500 rounded-md text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition font-medium"
                            >
                                {file ? "Change File" : "Choose File"}
                            </label>

                            {file && (
                                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                                    {file.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* --- Job Description --- */}
                    <div>
                        <h2 className="block font-medium text-gray-700 mb-2">
                            (Optional) Enter Your Job Description
                        </h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            placeholder="Paste job description here (optional)..."
                        />
                    </div>

                    {/* --- Analyze Button --- */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    {result ? (
                        <ResultsPanel result={result} history={history} />
                    ) : (
                        <div className="text-center text-gray-500">
                            Upload a resume and optionally a job description to
                            analyze.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
