import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

type Props = {
    history: { timestamp: number; score: number }[]; // timestamp epoch, score 0..1
};

export default function HistoryChart({ history }: Props) {
    if (!history?.length) {
        return (
            <p className="text-sm text-gray-500">No analysis history yet.</p>
        );
    }

    const labels = history.map((h) => new Date(h.timestamp).toLocaleString());
    const data = {
        labels,
        datasets: [
            {
                label: "Match Score",
                data: history.map((h) => Math.round(h.score * 100)),
                fill: false,
                tension: 0.3,
                borderColor: "rgba(59,130,246,1)",
                backgroundColor: "rgba(59,130,246,0.2)",
                pointRadius: 4,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: (val: any) => `${val}%`,
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y}%` } },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium mb-2">Match Score History</h3>
            <div style={{ height: 220 }}>
                <Line data={data as any} options={options as any} />
            </div>
        </div>
    );
}
