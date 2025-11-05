type Props = {
    skills?: string[];
    missing?: string[];
};

export default function SkillCloud({ skills = [], missing = [] }: Props) {
    if (!skills.length) {
        return <p className="text-sm text-gray-500">No detected skills.</p>;
    }

    const maxSize = 28;
    const minSize = 12;
    const N = skills.length;

    const computeSize = (idx: number) => {
        // higher index (0) => bigger
        const t = (N - idx) / N;
        return Math.round(minSize + (maxSize - minSize) * t);
    };

    return (
        <div className="flex flex-wrap gap-3">
            {skills.map((s, i) => {
                const isMissing = missing?.includes(s);
                const size = computeSize(i);
                return (
                    <span
                        key={s + i}
                        title={s}
                        className={`inline-block px-3 py-1 rounded-full transition-transform transform hover:scale-105`}
                        style={{
                            fontSize: `${size}px`,
                            backgroundColor: isMissing ? "#fef3c7" : "#eff6ff",
                            color: isMissing ? "#92400e" : "#1e3a8a",
                        }}
                    >
                        {s}
                    </span>
                );
            })}
        </div>
    );
}
