import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server-side only

export async function POST(req: NextRequest) {
    try {
        const { resume_text, target_role } = await req.json();

        // Forward file and job description to FastAPI
        const backendRes = await fetch("http://localhost:8000/api/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ resume_text, target_role }),
        });

        if (!backendRes.ok) {
            const text = await backendRes.text();
            return NextResponse.json(
                { error: "FastAPI returned an error", details: text },
                { status: 500 }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Error in Next.js API route:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
