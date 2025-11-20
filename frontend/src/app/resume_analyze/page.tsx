"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AnalyzeResponse } from "@/types/analyze";
import ResultsPanel from "@/components/ResultPanel";
import { getCache } from "@/utils/cache";

export default function ResumeAnalyzePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [history, setHistory] = useState<
        { timestamp: number; score: number }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);
    const [resumeText, setResumeText] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [showJDInput, setShowJDInput] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            router.push("/");
            return;
        }

        // Fetch from localStorage
        const stored = localStorage.getItem(`analyze_${id}`);
        if (stored) {
            setResult(JSON.parse(stored).value);
        }

        const rawHistory = getCache("analysis_history");
        if (rawHistory) {
            setHistory(JSON.parse(rawHistory));
        }

        // Load original resume text from localStorage (if stored before)
        const resumeText = getCache("resume_text");
        if (!resumeText) alert("Resume text not found");
        else setResumeText(resumeText);

        const targetRole = localStorage.getItem("target_role");
        if (targetRole) setJobDescription(targetRole);
        else setShowJDInput(true);

        setLoading(false);
    }, [id, router]);

    const handleOptimize = async () => {
        try {
            setOptimizing(true);
            if (!resumeText) return alert("Resume text not found.");

            const payload: Record<string, any> = {
                resume_text: resumeText,
            };

            if (jobDescription) {
                payload.target_role = jobDescription;
            } else {
                alert("Please provide a target role to proceed.");
                return;
            }

            const res = await fetch("/api/rewrite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }

            const data = await res.json();

            // Generate unique ID for rewritten result
            const newId = Date.now().toString();
            localStorage.setItem(`rewrite_${newId}`, JSON.stringify(data));

            // Redirect to /resume_optimize
            router.push(`/resume_optimize?id=${newId}`);
        } catch (err) {
            console.error("Optimize failed:", err);
            alert("Optimization failed. Please try again.");
        } finally {
            setOptimizing(false);
        }
    };

    if (loading || optimizing) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="ml-3 text-blue-700 font-semibold">
                        Loading analysis results...
                    </p>
                </div>
            </main>
        );
    }

    if (!result) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
                <p className="mb-4">No analysis data found.</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Home
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
            <div className="max-w-5xl w-full bg-white p-8 shadow-xl rounded-2xl border border-gray-100 relative">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/")}
                    className="absolute left-6 top-6 flex items-center text-blue-600 hover:text-blue-800 transition"
                >
                    <ChevronLeft size={18} className="mr-1" />
                    Back
                </button>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Resume Analysis Result
                </h1>

                <ResultsPanel result={result} history={history} />

                {/* --- Job Description --- */}
                {showJDInput && (
                    <div>
                        <h2 className="block font-medium text-gray-700 mb-2">
                            Desired Job Description
                        </h2>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 p-2 rounded-lg mt-3 text-gray-600 bg-gray-50 focus:bg-white"
                            placeholder="Paste job description here..."
                        />
                    </div>
                )}

                <div className="text-right mt-6">
                    <button
                        onClick={handleOptimize}
                        disabled={optimizing}
                        className={`px-4 py-2 rounded-md text-white transition ${
                            optimizing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {optimizing ? "Optimizing..." : "Optimize Resume"}
                    </button>
                </div>
            </div>
        </main>
    );
}
