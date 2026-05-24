"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/types/analytics";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import AnalyticsEmptyState from "./AnalyticsEmptyState";

type Props = {
  data: TopicRadarEntry[];
};

export default function TagPerformanceRadar({ data }: Props) {
  const maxSolved =
    data[0]?.difficultyEntries[Difficulty.All].numberOfSolved ?? 0;

  return (
    <AnalyticsCard
      title="Tag Performance Radar"
      description="problems solved per tag"
    >
      {data.length === 0 ? (
        <AnalyticsEmptyState className="h-80">
          No tag data yet
        </AnalyticsEmptyState>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="relative h-100 min-w-0">
            <ResponsiveContainer width="100%" height={400} minWidth={0}>
              <RadarChart data={data} outerRadius="75%">
                <PolarGrid stroke="var(--color-stone-600)" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{
                    fill: "var(--color-stone-200)",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  stroke="#1e1e1e"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as
                      | TopicRadarEntry
                      | undefined;
                    if (!row) return null;
                    return (
                      <DifficultyStatsTooltip
                        title={String(label)}
                        difficultyEntries={row.difficultyEntries}
                        difficulties={Object.values(Difficulty)}
                      />
                    );
                  }}
                />
                <Radar
                  name="Solved"
                  dataKey={(topic: TopicRadarEntry) =>
                    topic.difficultyEntries[Difficulty.All].numberOfSolved
                  }
                  stroke="#e7e5e4"
                  fill="#d4d4d8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Topics | number of solved problems */}
          <ul className="flex flex-col gap-2">
            {data.map((row) => {
              const totalSolved =
                row.difficultyEntries[Difficulty.All].numberOfSolved;
              const ratio = maxSolved > 0 ? totalSolved / maxSolved : 0;
              return (
                <li
                  key={row.topic}
                  className="flex items-center gap-3 rounded-lg text-xs border border-[#1e1e1e] bg-[#141414] px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold text-neutral-200">
                    {row.topic}
                  </span>
                  <span className="relative h-0.5 w-24 bg-neutral-600">
                    <span
                      className="absolute inset-y-0 left-0 bg-stone-200"
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-neutral-300">
                    {totalSolved}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AnalyticsCard>
  );
}
