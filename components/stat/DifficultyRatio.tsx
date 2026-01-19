"use client";

import { SolvedDurationStats } from "../../lib/userStat";
import { Pie, Cell, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { LayoutDashboard } from "lucide-react";
import { DIFFICULTY_COLORS } from "./AverageDuration";

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
            <Tooltip
              contentStyle={{
                background: "#333",
                border: "none",
                borderRadius: "4px",
              }}
            />
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
