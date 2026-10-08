"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import { CHART_COLORS, CHART_TICK_STYLE } from "@/constants/analytics";
import {
  DIFFICULTIES,
  DIFFICULTY_COLORS,
  type ProblemDifficulty,
} from "@/constants/difficulty";
import { toRoundedMinutes } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/types/analytics";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import DifficultyModeSelector, {
  DIFFICULTY_MODE_TO_DIFFICULTY,
  type DifficultyMode,
} from "./DifficultyModeSelector";

type Props = {
  data: TopicRadarEntry[];
};

const ROW_HEIGHT = 36;

function getSegmentDifficulties(selected: Difficulty): ProblemDifficulty[] {
  return selected === Difficulty.All ? DIFFICULTIES : [selected as ProblemDifficulty];
}

function getTooltipDifficulties(selected: Difficulty): Difficulty[] {
  return selected === Difficulty.All ? Object.values(Difficulty) : [selected];
}

/**
 * Minutes for one bar segment. For "All" the bar length is the topic's overall
 * average, split between difficulties in proportion to their own averages.
 */
function getBarValue(row: TopicRadarEntry, difficulty: ProblemDifficulty, selected: Difficulty) {
  const avgMinutes = toRoundedMinutes(row.difficultyEntries[difficulty].avgSolveDuration);
  if (selected !== Difficulty.All) return avgMinutes;

  const allAvgMinutes = toRoundedMinutes(row.difficultyEntries[Difficulty.All].avgSolveDuration);
  const sumAvgMinutes = DIFFICULTIES.reduce(
    (sum, d) => sum + toRoundedMinutes(row.difficultyEntries[d].avgSolveDuration),
    0,
  );

  return sumAvgMinutes > 0 ? (avgMinutes / sumAvgMinutes) * allAvgMinutes : 0;
}

export default function AvgSolveTimeByTopic({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");
  const selected = DIFFICULTY_MODE_TO_DIFFICULTY[mode];
  const segments = getSegmentDifficulties(selected);
  const chartHeight = Math.max(220, data.length * ROW_HEIGHT);

  return (
    <AnalyticsCard
      title="Average solve time by topic"
      description="Minutes per solved problem, split by difficulty"
      actions={
        data.length > 0 && <DifficultyModeSelector value={mode} onChange={setMode} />
      }
    >
      {data.length === 0 ? (
        <AnalyticsEmptyState>No topic data yet</AnalyticsEmptyState>
      ) : (
        <div className="min-w-0" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height={chartHeight} minWidth={0} minHeight={0}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
              barCategoryGap={14}
            >
              <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => `${Number(value).toFixed(0)}m`}
                tick={CHART_TICK_STYLE}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="topic"
                width={140}
                tick={{ ...CHART_TICK_STYLE, fill: "#e8eaeb", fontFamily: "var(--font-geist-sans)", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: CHART_COLORS.cursor }}
                content={({ active, payload, label }) => {
                  const row = payload?.[0]?.payload as TopicRadarEntry | undefined;
                  if (!active || !row) return null;

                  return (
                    <DifficultyStatsTooltip
                      title={String(label)}
                      difficultyEntries={row.difficultyEntries}
                      difficulties={getTooltipDifficulties(selected)}
                    />
                  );
                }}
              />
              {segments.map((difficulty, index) => (
                <Bar
                  key={difficulty}
                  dataKey={(row: TopicRadarEntry) => getBarValue(row, difficulty, selected)}
                  name={difficulty}
                  stackId="avg"
                  fill={DIFFICULTY_COLORS[difficulty]}
                  radius={index === segments.length - 1 ? [0, 3, 3, 0] : 0}
                  barSize={10}
                  background={index === 0 ? { fill: CHART_COLORS.track, radius: 3 } : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
