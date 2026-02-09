"use client";

import type { SolvedDurationStats } from "@/types/stat";
import {
  Pie,
  Cell,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
import { LayoutDashboard } from "lucide-react";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";

function DifficultyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const difficulty = item.name ?? "Unknown";
  const count = item.value ?? 0;

  return (
    <div className="rounded-md border border-[#3e3e3e] bg-[#1a1a1a] px-3 py-2 text-base shadow-lg">
      <div className="text-gray-300">
        {difficulty}: <span className="font-bold text-white">{count}</span>
      </div>
    </div>
  );
}

export default function DifficultyRatio({
  stats,
}: {
  stats: SolvedDurationStats;
}) {
  const difficultyStats = [
    {
      name: "Easy",
      value: stats.find((stat) => stat.difficulty === "Easy")?.count,
      color: DIFFICULTY_COLORS["Easy"],
    },
    {
      name: "Medium",
      value: stats.find((stat) => stat.difficulty === "Medium")?.count,
      color: DIFFICULTY_COLORS["Medium"],
    },
    {
      name: "Hard",
      value: stats.find((stat) => stat.difficulty === "Hard")?.count,
      color: DIFFICULTY_COLORS["Hard"],
    },
  ];
  const totalCount = stats.filter((stat) => stat.difficulty === "Total")[0]
    .count;
  return (
    <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] w-80">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
        <LayoutDashboard size={14} /> Difficulty Ratio
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={difficultyStats}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={8}
              dataKey="value"
            >
              {difficultyStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Label position="center" className="text-white" fill="#fff">
              {totalCount}
            </Label>
            <Tooltip content={<DifficultyTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-evenly mt-1">
        {stats
          .filter((stat) => stat.difficulty !== "Total")
          .map((stat) => (
            <div key={stat.difficulty} className="flex flex-col items-center">
              <div
                className="text-xs font-semibold"
                style={{ color: DIFFICULTY_COLORS[stat.difficulty] }}
              >
                {stat.difficulty}
              </div>
              <div className="text-white font-bold">{stat.count}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
