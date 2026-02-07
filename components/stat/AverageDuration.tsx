import type { SolvedDurationStats } from "@/types/stat";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import { BarChart2 } from "lucide-react";

export default function AverageDuration({
  stats,
}: {
  stats: SolvedDurationStats;
}) {
  const difficultyStats = stats.filter((stat) => stat.difficulty !== "Total");
  const maxDuration = Math.max(
    ...difficultyStats.map((stat) => stat.totalDuration),
    0,
  );

  return (
    <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] w-80">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
        <BarChart2 size={14} /> Average Solve Time
      </h3>
      <div className="space-y-5">
        {difficultyStats.map((stat) => (
          <div key={stat.difficulty}>
            <div className="flex justify-between text-[10px] mb-2 font-bold tracking-tighter">
              <span className="text-gray-400 uppercase">{stat.difficulty}</span>
              <span style={{ color: DIFFICULTY_COLORS[stat.difficulty] }}>
                {(stat.totalDuration / 60).toFixed(1)}m
              </span>
            </div>
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  backgroundColor: DIFFICULTY_COLORS[stat.difficulty],
                  width:
                    maxDuration > 0 && stat.totalDuration > 0
                      ? `${(stat.totalDuration * 100) / maxDuration}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
