import type { SolvedDurationStats } from "../../lib/userStat";
import { BarChart2 } from "lucide-react";

export const DIFFICULTY_COLORS = {
  Easy: "#00af9b",
  Medium: "#ffb800",
  Hard: "#ff2d55",
};

export default function AverageDuration({
  stats,
}: {
  stats: SolvedDurationStats;
}) {
  return (
    <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] w-80">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
        <BarChart2 size={14} /> Average Solution Time
      </h3>
      <div className="space-y-5">
        {stats.map((stat) => (
          <div key={stat.difficulty}>
            <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{stat.difficulty}</span>
              <span style={{ color: DIFFICULTY_COLORS[stat.difficulty] }}>
                {stat.averageMin}m
              </span>
            </div>
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  backgroundColor: DIFFICULTY_COLORS[stat.difficulty],
                  width: `${(stat.averageMin * 100) / Math.max(...stats.map((stat) => stat.averageMin))}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
