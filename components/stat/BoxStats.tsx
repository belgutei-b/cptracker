"use client";

import { SolvedDurationStats } from "@/types/stat";
import { formatDayMonthYear, formatDuration } from "@/lib/date";

export default function BoxStats({
  stats,
  lastSolvedAt,
}: {
  stats: SolvedDurationStats;
  lastSolvedAt: string | null;
}) {
  const averageSeconds =
    stats[3].count > 0
      ? Math.floor(stats[3].totalDuration / stats[3].count)
      : 0;

  return (
    <div>
      <div className="text-lg text-white font-bold mb-4">
        Solved problems stat
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-5 w-80">
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Total Solved</p>
          <p className="dashboard-stat-text">{stats[3].count}</p>
        </div>
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Total Time</p>
          <p className="dashboard-stat-text">
            {formatDuration(stats[3].totalDuration)}
          </p>
        </div>
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Avg Time</p>
          <p className="dashboard-stat-text">
            {formatDuration(averageSeconds)}
          </p>
        </div>
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Last Solved</p>
          <p className="dashboard-stat-text">
            {formatDayMonthYear(lastSolvedAt, undefined, "-")}
          </p>
        </div>
      </div>
    </div>
  );
}
