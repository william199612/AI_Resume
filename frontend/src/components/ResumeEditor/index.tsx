"use client";

import { useState, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Mail, Phone, Linkedin, MapPin, Link as LinkIcon } from "lucide-react";
import { RewriteResponse, EditableResumeProps } from "@/types/analyze";

export default function ResumeEditor({
    initialData,
    onUpdate,
}: EditableResumeProps) {
    const [resume, setResume] = useState<RewriteResponse>(initialData);
    const resumeRef = useRef(resume);

    useEffect(() => {
        resumeRef.current = resume;
    }, [resume]);

    // Helper: Handle generic text updates
    const handleChange = (section: keyof RewriteResponse, value: any) => {
        const newData = { ...resume, [section]: value };
        setResume(newData);
        // only trigger the parent update on Blur to prevent excessive saving
    };

    // Helper: Trigger parent save on blur
    const handleBlur = () => {
        if (onUpdate) {
            onUpdate(resumeRef.current);
        }
    };

    const handleContactUpdate = (
        field: keyof typeof resume.contact_info,
        value: string
    ) => {
        const newData = {
            ...resume,
            contact_info: { ...resume.contact_info, [field]: value },
        };
        setResume(newData);
    };

    // Helper: Nested updates for arrays (Experience, Education, Projects)
    const handleArrayUpdate = (
        section: "experience" | "education" | "projects",
        index: number,
        field: string,
        value: string
    ) => {
        const list = [...(resume[section] || [])] as any[];
        list[index] = { ...list[index], [field]: value };

        const newData = { ...resume, [section]: list };
        setResume(newData);
    };

    const capitalizeFirstLetter = (str: string): string => {
        if (str.length === 0) {
            return "";
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Common styles for editable fields
    const editableClass =
        "hover:bg-blue-50 hover:outline-dashed hover:outline-1 hover:outline-blue-300 rounded px-1 -mx-1 transition-colors cursor-text empty:before:content-[attr(placeholder)] empty:before:text-gray-400 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-200";

    return (
        <div className="w-full max-w-[210mm] mx-auto bg-white shadow-2xl mb-10 min-h-[297mm] p-[15mm] md:p-[20mm] text-slate-800 font-sans leading-relaxed print:shadow-none print:p-0 print:max-w-full">
            {/* HEADER / CONTACT */}
            <header className="border-b-2 border-slate-800 pb-6 mb-6 text-center">
                <ContentEditable
                    html={resume.contact_info.name || ""}
                    onChange={(e) =>
                        handleContactUpdate("name", e.target.value)
                    }
                    onBlur={handleBlur}
                    tagName="h1"
                    className={`text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2 ${editableClass}`}
                    placeholder="YOUR NAME"
                />

                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mt-3">
                    {/* Email */}
                    <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <ContentEditable
                            html={resume.contact_info.email || ""}
                            onChange={(e) =>
                                handleContactUpdate("email", e.target.value)
                            }
                            onBlur={handleBlur}
                            tagName="span"
                            className={editableClass}
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <ContentEditable
                            html={resume.contact_info.phone || ""}
                            onChange={(e) =>
                                handleContactUpdate("phone", e.target.value)
                            }
                            onBlur={handleBlur}
                            tagName="span"
                            className={editableClass}
                            placeholder="+1 234 567 890"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <ContentEditable
                            html={resume.contact_info.address || ""}
                            onChange={(e) =>
                                handleContactUpdate("address", e.target.value)
                            }
                            onBlur={handleBlur}
                            tagName="span"
                            className={editableClass}
                            placeholder="City, Country"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex items-center gap-1">
                        <Linkedin size={14} />
                        <ContentEditable
                            html={resume.contact_info.linkedin || ""}
                            onChange={(e) =>
                                handleContactUpdate("linkedin", e.target.value)
                            }
                            onBlur={handleBlur}
                            tagName="span"
                            className={editableClass}
                            placeholder="linkedin.com/in/username"
                        />
                    </div>
                </div>
            </header>

            {/* SUMMARY */}
            <section className="mb-8">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">
                    Professional Summary
                </h2>
                <ContentEditable
                    html={resume.summary || ""}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    onBlur={handleBlur}
                    tagName="p"
                    className={`text-sm text-slate-700 leading-6 text-justify ${editableClass}`}
                    placeholder="Write a compelling summary..."
                />
            </section>

            {/* SKILLS */}
            <section className="mb-8">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 mb-3 pb-1">
                    Skills
                </h2>

                {resume.skills &&
                    Object.entries(resume.skills).map(([category, skills]) => (
                        <div key={category} className="mb-4">
                            {/* Category Label */}
                            <div className="text-base font-semibold text-slate-500 mb-1 capitalize">
                                {capitalizeFirstLetter(
                                    category.replace("_", " ")
                                )}
                            </div>

                            {/* Editable Skills */}
                            <ul className="list-disc list-inside space-y-1">
                                {skills.map((skill, index) => (
                                    <li key={index}>
                                        <ContentEditable
                                            html={skill}
                                            onChange={(e) => {
                                                const updatedSkills = [
                                                    ...skills,
                                                ];
                                                updatedSkills[index] =
                                                    e.target.value;
                                                handleChange("skills", {
                                                    ...resume.skills,
                                                    [category]: updatedSkills,
                                                });
                                            }}
                                            onBlur={handleBlur}
                                            tagName="span"
                                            className={`text-sm text-slate-500 font-medium ${editableClass}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </section>

            {/* EXPERIENCE */}
            <section className="mb-8">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 mb-4 pb-1">
                    Experience
                </h2>
                <div className="space-y-6">
                    {resume.experience.map((exp, idx) => (
                        <div key={idx} className="group">
                            {/* Header: Company & Date */}
                            <div className="flex justify-between items-baseline mb-1">
                                <ContentEditable
                                    html={exp.company || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "experience",
                                            idx,
                                            "company",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="h3"
                                    className={`font-bold text-slate-800 text-base ${editableClass}`}
                                    placeholder="Company Name"
                                />
                                <ContentEditable
                                    html={exp.dates || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "experience",
                                            idx,
                                            "dates",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="span"
                                    className={`text-sm text-slate-500 font-medium ${editableClass}`}
                                    placeholder="Enter your dates here"
                                />
                            </div>

                            {/* Title */}
                            <ContentEditable
                                html={exp.title || ""}
                                onChange={(e) =>
                                    handleArrayUpdate(
                                        "experience",
                                        idx,
                                        "title",
                                        e.target.value
                                    )
                                }
                                onBlur={handleBlur}
                                tagName="div"
                                className={`text-sm font-semibold text-blue-700 mb-2 ${editableClass}`}
                                placeholder="Job Title"
                            />

                            {/* Details */}
                            <ContentEditable
                                html={exp.details || ""}
                                onChange={(e) =>
                                    handleArrayUpdate(
                                        "experience",
                                        idx,
                                        "details",
                                        e.target.value
                                    )
                                }
                                onBlur={handleBlur}
                                tagName="div"
                                className={`text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ${editableClass}`}
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            {resume.projects && resume.projects.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 mb-4 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-5">
                        {resume.projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <ContentEditable
                                        html={proj.name || ""}
                                        onChange={(e) =>
                                            handleArrayUpdate(
                                                "projects",
                                                idx,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        onBlur={handleBlur}
                                        tagName="h3"
                                        className={`font-bold text-slate-800 text-sm ${editableClass}`}
                                        placeholder="Project Name"
                                    />
                                    <div className="flex items-center gap-1 text-slate-500">
                                        {proj.link && <LinkIcon size={12} />}
                                        <ContentEditable
                                            html={proj.link || ""}
                                            onChange={(e) =>
                                                handleArrayUpdate(
                                                    "projects",
                                                    idx,
                                                    "link",
                                                    e.target.value
                                                )
                                            }
                                            onBlur={handleBlur}
                                            tagName="span"
                                            className={`text-xs italic ${editableClass}`}
                                            placeholder="Link (optional)"
                                        />
                                    </div>
                                </div>
                                <ContentEditable
                                    html={proj.description || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "projects",
                                            idx,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="div"
                                    className={`text-sm text-slate-700 leading-relaxed ${editableClass}`}
                                    placeholder="Project description..."
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            <section>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 mb-4 pb-1">
                    Education
                </h2>
                <div className="space-y-4">
                    {resume.education.map((edu, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-baseline mb-1">
                                <ContentEditable
                                    html={edu.school || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "education",
                                            idx,
                                            "school",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="h3"
                                    className={`font-bold text-slate-800 text-sm ${editableClass}`}
                                    placeholder="University / School"
                                />
                                <ContentEditable
                                    html={edu.dates || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "education",
                                            idx,
                                            "dates",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="span"
                                    className={`text-sm text-slate-500 font-medium ${editableClass}`}
                                    placeholder="Graduation Date"
                                />
                            </div>
                            <ContentEditable
                                html={edu.degree || ""}
                                onChange={(e) =>
                                    handleArrayUpdate(
                                        "education",
                                        idx,
                                        "degree",
                                        e.target.value
                                    )
                                }
                                onBlur={handleBlur}
                                tagName="div"
                                className={`text-sm text-slate-700 ${editableClass}`}
                                placeholder="Degree / Major"
                            />
                            {edu.details && (
                                <ContentEditable
                                    html={edu.details || ""}
                                    onChange={(e) =>
                                        handleArrayUpdate(
                                            "education",
                                            idx,
                                            "details",
                                            e.target.value
                                        )
                                    }
                                    onBlur={handleBlur}
                                    tagName="div"
                                    className={`text-xs text-slate-600 mt-1 ${editableClass}`}
                                    placeholder="Additional details..."
                                />
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
