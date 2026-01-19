"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const BAR_COLORS = {
  // easy: "oklch(43.2% 0.095 166.913)",
  easy: "oklch(39.3% 0.095 152.535)",
  medium: "#8a6a00",
  hard: "#7a1f35",
};

const BASE_DATA = [
  { easy: 18, medium: 32, hard: 8, solved: 4 },
  { easy: 10, medium: 24, hard: 12, solved: 3 },
  { easy: 22, medium: 18, hard: 6, solved: 5 },
  { easy: 12, medium: 40, hard: 14, solved: 6 },
  { easy: 8, medium: 26, hard: 20, solved: 4 },
  { easy: 16, medium: 12, hard: 10, solved: 2 },
  { easy: 20, medium: 28, hard: 16, solved: 5 },
];

function formatMonthDay(date: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function getLastSevenDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return formatMonthDay(date);
  });
}

export default function WeeklyActivityChart() {
  const labels = getLastSevenDays();
  const data = BASE_DATA.map((entry, index) => ({
    day: labels[index],
    ...entry,
  }));

  return (
    <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] w-full max-w-3xl">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Weekly Activity
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#3e3e3e" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis
              yAxisId="minutes"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="solved"
              orientation="right"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Solved", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                background: "#333",
                border: "none",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Bar
              yAxisId="minutes"
              dataKey="easy"
              stackId="time"
              name="Easy"
              fill={BAR_COLORS.easy}
            />
            <Bar
              yAxisId="minutes"
              dataKey="medium"
              stackId="time"
              name="Medium"
              fill={BAR_COLORS.medium}
            />
            <Bar
              yAxisId="minutes"
              dataKey="hard"
              stackId="time"
              name="Hard"
              fill={BAR_COLORS.hard}
            />
            <Line
              yAxisId="solved"
              type="monotone"
              dataKey="solved"
              name="Solved"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
