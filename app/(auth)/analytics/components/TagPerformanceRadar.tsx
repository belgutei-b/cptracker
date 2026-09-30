"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import { CHART_COLORS } from "@/constants/analytics";
import { DIFFICULTIES, DIFFICULTY_DOT_CLASS } from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/types/analytics";
import AnalyticsEmptyState from "./AnalyticsEmptyState";

type Props = {
  data: TopicRadarEntry[];
};

const RADAR_HEIGHT = 380;

function getSolved(topic: TopicRadarEntry, difficulty: Difficulty = Difficulty.All) {
  return topic.difficultyEntries[difficulty].numberOfSolved;
}

/** problems solved per topic: radar for the shape, list for the numbers */
export default function TagPerformanceRadar({ data }: Props) {
  // topics arrive sorted by solved count
  const maxSolved = data[0] ? getSolved(data[0]) : 0;

  return (
    <AnalyticsCard title="Problems solved per topic" description="Your 10 most-solved topics, by difficulty">
      {data.length === 0 ? (
        <AnalyticsEmptyState className="h-80">No topic data yet</AnalyticsEmptyState>
      ) : (
        <div className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div className="min-w-0" style={{ height: RADAR_HEIGHT }}>
            <ResponsiveContainer width="100%" height={RADAR_HEIGHT} minWidth={0}>
              <RadarChart data={data} outerRadius="72%">
                <PolarGrid stroke={CHART_COLORS.grid} />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fill: CHART_COLORS.axis, fontSize: 12, fontFamily: "var(--font-geist-sans)" }}
                />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    const row = payload?.[0]?.payload as TopicRadarEntry | undefined;
                    if (!active || !row) return null;
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
                  dataKey={(topic: TopicRadarEntry) => getSolved(topic)}
                  stroke={CHART_COLORS.solvedLine}
                  fill={CHART_COLORS.solvedLine}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex flex-col gap-3">
            {data.map((topic) => {
              const total = getSolved(topic);
              return (
                <li key={topic.topic} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{topic.topic}</span>
                    <span className="font-mono text-foreground/75">{total}</span>
                  </div>
                  {/* bar length is relative to the top topic, split by difficulty */}
                  <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="flex h-full gap-px"
                      style={{ width: `${maxSolved > 0 ? (total / maxSolved) * 100 : 0}%` }}
                    >
                      {DIFFICULTIES.map((difficulty) => {
                        const solved = getSolved(topic, difficulty);
                        return solved > 0 ? (
                          <span
                            key={difficulty}
                            className={DIFFICULTY_DOT_CLASS[difficulty]}
                            style={{ flexGrow: solved }}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AnalyticsCard>
  );
}
