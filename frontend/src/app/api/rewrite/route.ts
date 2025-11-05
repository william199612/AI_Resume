import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server-side only

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Forward file and job description to FastAPI
        const backendRes = await fetch("http://localhost:8000/api/rewrite", {
            method: "POST",
            body: formData, // Forward as-is
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
