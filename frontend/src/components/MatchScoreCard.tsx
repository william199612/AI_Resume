type Props = { score: number | null };

export default function MatchScoreCard({ score }: Props) {
    const pct =
        score !== null && score !== undefined
            ? Math.round((score || 0) * 100)
            : null;
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Match Score</p>
                    <p className="text-3xl font-bold text-blue-700">
                        {pct !== null ? `${pct}%` : "N/A"}
                    </p>
                </div>
                <div className="w-48">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-600"
                            style={{ width: pct !== null ? `${pct}%` : "0%" }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {pct !== null
                            ? `Confidence ${pct}%`
                            : "No job description provided"}
                    </p>
                </div>
            </div>
        </div>
    );
}
