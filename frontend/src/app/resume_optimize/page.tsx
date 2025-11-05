"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResumeEditor from "@/components/ResumeEditor";
import { RewriteResponse } from "@/types/analyze";

export default function ResumeRewritePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState<RewriteResponse | null>(null);

    useEffect(() => {
        const rewriteId = searchParams.get("id");
        if (!rewriteId) {
            router.push("/");
            return;
        }

        const storedData = localStorage.getItem(`rewrite_${rewriteId}`);
        if (!storedData) {
            router.push("/");
            return;
        }

        setResumeData(JSON.parse(storedData));
        setLoading(false);
    }, [searchParams, router]);

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-pulse text-lg font-medium text-gray-700">
                    ✨ Optimizing your resume...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    ✏️ Your Optimized Resume
                </h1>
                {resumeData && <ResumeEditor initialData={resumeData} />}
            </div>
        </main>
    );
}
