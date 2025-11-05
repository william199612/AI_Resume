"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AnalyzeResponse } from "@/types/analyze";
import ResultsPanel from "@/components/ResultPanel";

export default function ResumeAnalyzePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [targetRole, setTargetRole] = useState<string>("");
    const [history, setHistory] = useState<{ ts: number; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) {
            router.push("/");
            return;
        }

        // Fetch from localStorage
        const stored = localStorage.getItem(`analyze_${id}`);
        if (stored) {
            setResult(JSON.parse(stored));
        }

        // Load target role if exists
        const storedRole = localStorage.getItem(`target_role_${id}`);
        if (storedRole) {
            setTargetRole(storedRole);
        }

        const rawHistory = localStorage.getItem("analysis_history");
        if (rawHistory) {
            setHistory(JSON.parse(rawHistory));
        }

        // Load original uploaded file from localStorage (if stored before)
        const storedFileName = localStorage.getItem(`resume_file_name`);
        const storedFileData = localStorage.getItem(`resume_file_data`);
        if (storedFileName && storedFileData) {
            const blob = new Blob([
                Uint8Array.from(atob(storedFileData), (c) => c.charCodeAt(0)),
            ]);
            setFile(new File([blob], storedFileName));
        }

        setLoading(false);
    }, [id, router]);

    const handleOptimize = async (target_role: string) => {
        try {
            setOptimizing(true);
            if (!file) return alert("Please upload your resume file.");

            const formData = new FormData();
            formData.append("file", file);

            if (target_role) {
                formData.append("target_role", target_role);
            } else {
                alert("Please provide a target role.");
                return;
            }

            const res = await fetch("/api/rewrite", {
                method: "POST",
                body: formData,
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

                <div className="text-right mt-6">
                    <button
                        onClick={() => handleOptimize(targetRole)}
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
