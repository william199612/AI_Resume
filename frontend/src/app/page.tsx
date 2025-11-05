"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [history, setHistory] = useState<{ ts: number; score: number }[]>([]);

    useEffect(() => {
        const raw = localStorage.getItem("analysis_history");
        if (raw) setHistory(JSON.parse(raw));
    }, []);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Save file metadata for resume_analyze
            localStorage.setItem("resume_file_name", selectedFile.name);

            // Convert to Base64 and store
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = (reader.result as string).split(",")[1];
                localStorage.setItem("resume_file_data", base64Data);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please upload your resume file.");

        const formData = new FormData();
        formData.append("file", file);
        if (jobDescription) {
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

            // Save data temporarily for the analyze page
            const id = Date.now().toString();
            localStorage.setItem(`analyze_${id}`, JSON.stringify(data));

            // Save target role in localStorage (if user entered job description)
            if (jobDescription) {
                localStorage.setItem(`target_role_${id}`, jobDescription);
            }

            // Update history for home page persistence
            const nextHistory = [
                ...history,
                { ts: Date.now(), score: 0 },
            ].slice(-20);
            setHistory(nextHistory);
            localStorage.setItem(
                "analysis_history",
                JSON.stringify(nextHistory)
            );

            // Navigate to analyze page
            router.push(`/resume_analyze?id=${id}`);
        } catch (err) {
            console.error(err);
            alert("Error analyzing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-blue-700 font-semibold">
                        Processing...
                    </p>
                </div>
            )}

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
                                className="px-3 py-1.5 border border-blue-500 rounded-md text-blue-700 text-sm cursor-pointer hover:bg-gray-100 transition font-medium"
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
                            Desired Job Description (Optional)
                        </h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 p-2 rounded-lg mt-3 text-gray-600 bg-gray-50 focus:bg-white"
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
            </div>
        </main>
    );
}
