"use client";

import { useState } from "react";
import { AnalyzeResponse } from "@/types/analyze";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [useJobDescription, setUseJobDescription] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);

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
            <div className="max-w-2xl w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Smart Resume Analyzer
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Resume (PDF/DOCX)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleUpload}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={useJobDescription}
                            onChange={(e) =>
                                setUseJobDescription(e.target.checked)
                            }
                        />
                        <label className="text-sm text-gray-700">
                            Include Job Description
                        </label>
                    </div>

                    {useJobDescription && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) =>
                                    setJobDescription(e.target.value)
                                }
                                rows={4}
                                className="w-full border border-gray-300 p-2 rounded-lg"
                                placeholder="Paste job description here..."
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>
                </form>

                {/* Results Section */}
                {result && (
                    <div className="mt-10 space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Analysis Result
                        </h2>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="font-semibold">Summary:</p>
                            <p className="text-gray-700">
                                {result.resume_summary}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="font-semibold">Extracted Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {result.extracted_skills?.length ? (
                                    result.extracted_skills.map(
                                        (skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-gray-500">
                                        No skills detected.
                                    </p>
                                )}
                            </div>
                        </div>

                        {result.match_score !== null && (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <p className="font-semibold">Match Score:</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {(result.match_score * 100).toFixed(1)}%
                                </p>
                            </div>
                        )}

                        {result.ai_suggestions && (
                            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
                                <p className="font-semibold text-gray-800">
                                    AI Suggestions:
                                </p>

                                {result.ai_suggestions.missing_keywords && (
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            Missing Keywords:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {result.ai_suggestions.missing_keywords.map(
                                                (k, i) => (
                                                    <li key={i}>{k}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {result.ai_suggestions.improvement_areas && (
                                    <div>
                                        <p className="font-medium text-gray-700">
                                            Improvement Areas:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {result.ai_suggestions.improvement_areas.map(
                                                (a, i) => (
                                                    <li key={i}>{a}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {result.ai_suggestions.summary && (
                                    <p className="italic text-gray-600">
                                        {result.ai_suggestions.summary}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
