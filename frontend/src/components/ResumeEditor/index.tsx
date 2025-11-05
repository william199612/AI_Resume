"use client";

import { useState, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { RewriteResponse, EditableResumeProps } from "@/types/analyze";

export default function ResumeEditor({ initialData }: EditableResumeProps) {
    const [resume, setResume] = useState<RewriteResponse>(initialData);
    const resumeRef = useRef(resume);

    const updateRef = (section: keyof RewriteResponse, value: any) => {
        resumeRef.current = { ...resumeRef.current, [section]: value };
    };

    const handleBlur = () => {
        setResume({ ...resumeRef.current });
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
            {/* CONTACT INFO */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Contact Info
                </h3>
                {Object.entries(resume.contact_info).map(([key, val]) => (
                    <ContentEditable
                        key={key}
                        html={val || ""}
                        onChange={(e) => {
                            const updated = {
                                ...resumeRef.current.contact_info,
                                [key]: e.target.value,
                            };
                            updateRef("contact_info", updated);
                        }}
                        onBlur={handleBlur}
                        className="p-2 mb-1 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </section>

            {/* SUMMARY */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Summary
                </h3>
                <ContentEditable
                    html={resume.summary || ""}
                    onChange={(e) => updateRef("summary", e.target.value)}
                    onBlur={handleBlur}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </section>

            {/* EXPERIENCE */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Experience
                </h3>
                {resume.experience.map((exp, idx) => (
                    <div
                        key={idx}
                        className="p-2 my-2 rounded-md border border-gray-300 bg-white"
                    >
                        {Object.entries(exp).map(([key, val]) => (
                            <ContentEditable
                                key={key}
                                html={val || ""}
                                onChange={(e) => {
                                    const updatedExperience = [
                                        ...resumeRef.current.experience,
                                    ];
                                    updatedExperience[idx] = {
                                        ...updatedExperience[idx],
                                        [key]: e.target.value,
                                    };
                                    updateRef("experience", updatedExperience);
                                }}
                                onBlur={handleBlur}
                                className="p-1 mb-1 rounded-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        ))}
                    </div>
                ))}
            </section>

            {/* EDUCATION */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Education
                </h3>
                {resume.education.map((edu, idx) => (
                    <div
                        key={idx}
                        className="p-2 my-2 rounded-md border border-gray-300 bg-white"
                    >
                        {Object.entries(edu).map(([key, val]) => (
                            <ContentEditable
                                key={key}
                                html={val || ""}
                                onChange={(e) => {
                                    const updatedEducation = [
                                        ...resumeRef.current.education,
                                    ];
                                    updatedEducation[idx] = {
                                        ...updatedEducation[idx],
                                        [key]: e.target.value,
                                    };
                                    updateRef("education", updatedEducation);
                                }}
                                onBlur={handleBlur}
                                className="p-1 mb-1 rounded-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                        ))}
                    </div>
                ))}
            </section>

            {/* SKILLS */}
            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Skills</h3>
                <ContentEditable
                    html={resume.skills.join(", ")}
                    onChange={(e) =>
                        updateRef(
                            "skills",
                            e.target.value.split(",").map((s) => s.trim())
                        )
                    }
                    onBlur={handleBlur}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </section>

            {/* PROJECTS */}
            {(resume.projects ?? []).length > 0 && (
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Projects
                    </h3>
                    {(resume.projects ?? []).map((proj, idx) => (
                        <div
                            key={idx}
                            className="p-2 my-2 rounded-md border border-gray-300 bg-white"
                        >
                            {Object.entries(proj).map(([key, val]) => (
                                <ContentEditable
                                    key={key}
                                    html={val || ""}
                                    onChange={(e) => {
                                        const updatedProjects = [
                                            ...((resumeRef.current.projects ??
                                                []) as any),
                                        ];
                                        updatedProjects[idx] = {
                                            ...updatedProjects[idx],
                                            [key]: e.target.value,
                                        };
                                        updateRef("projects", updatedProjects);
                                    }}
                                    onBlur={handleBlur}
                                    className="p-1 mb-1 rounded-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            ))}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
