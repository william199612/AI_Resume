import { AnalyzeResponse } from "@/types/analyze";
import MatchScoreCard from "./MatchScoreCard";
import SkillCloud from "./SkillCloud";
import HistoryChart from "./HistoryChart";

type Props = {
    result: AnalyzeResponse;
    history: { ts: number; score: number }[];
};

export default function ResultsPanel({ result, history }: Props) {
    const missing = result.missing_keywords ?? [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <h3 className="text-blue-500 font-semibold mb-2">
                            Resume Summary
                        </h3>
                        <p className="text-gray-700">{result.summary}</p>
                    </div>

                    <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
                        <h3 className="text-blue-500 font-semibold mb-2">
                            Extracted Skills
                        </h3>
                        <SkillCloud
                            skills={result.extracted_skills ?? []}
                            missing={missing}
                        />
                    </div>

                    {result.improvement_areas && result.missing_keywords && (
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="text-blue-500 font-semibold mb-2">
                                Suggestions on Improvement Areas
                            </h3>
                            {result.improvement_areas?.length && (
                                <>
                                    <ul className="list-disc list-inside text-gray-600 mb-3">
                                        {result.improvement_areas.map(
                                            (a, i) => (
                                                <li key={i}>{a}</li>
                                            )
                                        )}
                                    </ul>
                                </>
                            )}
                            {result.missing_keywords.length && (
                                <>
                                    <p className="font-medium text-gray-400">
                                        Missing Keywords
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {result.missing_keywords.map((k, i) => (
                                            <span
                                                key={i}
                                                className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <MatchScoreCard score={result.match_score ?? null} />
                    <HistoryChart history={history} />
                </div>
            </div>
        </div>
    );
}
