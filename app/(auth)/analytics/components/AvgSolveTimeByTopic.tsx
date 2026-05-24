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
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import { toRoundedMinutes } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { TopicRadarEntry } from "@/types/analytics";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import DifficultyStatsTooltip from "@/components/analytics/DifficultyStatsTooltip";
import AnalyticsEmptyState from "./AnalyticsEmptyState";
import DifficultyModeSelector, {
  DIFFICULTY_MODE_TO_DIFFICULTY,
  type DifficultyMode,
} from "./DifficultyModeSelector";

type Props = {
  data: TopicRadarEntry[];
};

type DisplayDifficulty = Exclude<Difficulty, "All">;

const DISPLAY_DIFFICULTIES: DisplayDifficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

function getSegmentDifficulties(
  selectedDifficulty: Difficulty,
): DisplayDifficulty[] {
  return selectedDifficulty === Difficulty.All
    ? DISPLAY_DIFFICULTIES
    : [selectedDifficulty as DisplayDifficulty];
}

function getTooltipDifficulties(selectedDifficulty: Difficulty): Difficulty[] {
  return selectedDifficulty === Difficulty.All
    ? Object.values(Difficulty)
    : [selectedDifficulty];
}

function getBarValue(
  row: TopicRadarEntry,
  difficulty: DisplayDifficulty,
  selectedDifficulty: Difficulty,
): number {
  const avgMin = toRoundedMinutes(
    row.difficultyEntries[difficulty].avgSolveDuration,
  );

  if (selectedDifficulty !== Difficulty.All) {
    return avgMin;
  }

  const allAvgMin = toRoundedMinutes(
    row.difficultyEntries[Difficulty.All].avgSolveDuration,
  );
  const sumAvgMin = DISPLAY_DIFFICULTIES.reduce(
    (sum, item) =>
      sum + toRoundedMinutes(row.difficultyEntries[item].avgSolveDuration),
    0,
  );

  return sumAvgMin > 0 ? (avgMin / sumAvgMin) * allAvgMin : 0;
}

export default function AvgSolveTimeByTopic({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");
  const selectedDifficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];
  const segmentDifficulties = getSegmentDifficulties(selectedDifficulty);
  const chartHeight = Math.max(220, data.length * 36);

  return (
    <AnalyticsCard
      title="Avg Solve Time by Topic"
      description="time spent per topic"
      actions={<DifficultyModeSelector value={mode} onChange={setMode} />}
    >
      {data.length === 0 ? (
        <AnalyticsEmptyState>No topic data yet</AnalyticsEmptyState>
      ) : (
        <div className="min-w-0" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 16, bottom: 4, left: 12 }}
              barCategoryGap={18}
            >
              <CartesianGrid
                stroke="#1e1e1e"
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis
                type="number"
                tickFormatter={(value) => `${Number(value).toFixed(0)}m`}
                tick={{
                  fill: "var(--color-zinc-300)",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="topic"
                width={140}
                tick={{
                  fill: "var(--color-stone-300)",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
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
                      difficulties={getTooltipDifficulties(selectedDifficulty)}
                    />
                  );
                }}
              />
              {segmentDifficulties.map((difficulty, index) => {
                const isLastSegment = index === segmentDifficulties.length - 1;

                return (
                  <Bar
                    key={difficulty}
                    dataKey={(row: TopicRadarEntry) =>
                      getBarValue(row, difficulty, selectedDifficulty)
                    }
                    name={difficulty}
                    stackId="avg"
                    fill={COLORS[difficulty]}
                    radius={isLastSegment ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                    barSize={6}
                    background={{ fill: "#1a1a1a", radius: 4 }}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
