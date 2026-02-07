"use client";

import { SolvedDurationStats } from "@/types/stat";
import { formatMMSS } from "@/lib/timer";

export default function BoxStats({ stats }: { stats: SolvedDurationStats }) {
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
            {formatMMSS(stats[3].totalDuration)}
          </p>
        </div>
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Avg Time</p>
          <p className="dashboard-stat-text">
            {formatMMSS(stats[3].totalDuration)}
          </p>
        </div>
        <div className="dashboard-stat-box">
          <p className="dashboard-stat-title">Current Streak</p>
          <p className="dashboard-stat-text">12 Days</p>
        </div>
      </div>
    </div>
  );
}
