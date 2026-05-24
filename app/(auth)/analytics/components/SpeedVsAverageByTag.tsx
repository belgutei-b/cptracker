"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";
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

function formatPercent(value: number): string {
  const rounded = Math.round(value);
  return `${Math.abs(rounded)}%`;
}

function PaceComparisonValue({
  value,
  numberOfSolved,
}: {
  value: number;
  numberOfSolved: number;
}) {
  if (numberOfSolved === 0) return <span>-</span>;

  const rounded = Math.round(value);

  if (!Number.isFinite(value) || rounded === 0) {
    return (
      <span className="inline-flex items-center justify-end gap-1 text-zinc-400">
        -
      </span>
    );
  }

  if (value > 0) {
    return (
      <span
        className="inline-flex items-center justify-end gap-1"
        style={{ color: DIFFICULTY_COLORS.Hard }}
      >
        <ArrowUp size={12} strokeWidth={2.5} />
        {formatPercent(value)}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-end gap-1"
      style={{ color: DIFFICULTY_COLORS.Easy }}
    >
      <ArrowDown size={12} strokeWidth={2.5} />
      {formatPercent(value)}
    </span>
  );
}

function getTooltipDifficulties(mode: DifficultyMode): Difficulty[] {
  const difficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];

  return difficulty === Difficulty.All
    ? Object.values(Difficulty)
    : [difficulty];
}

export default function SpeedVsAverageByTag({ data }: Props) {
  const [mode, setMode] = useState<DifficultyMode>("all");

  const rows = useMemo(() => {
    const difficulty = DIFFICULTY_MODE_TO_DIFFICULTY[mode];

    return data
      .map((topic) => {
        const entry = topic.difficultyEntries[difficulty];
        return {
          tag: topic.topic,
          value: entry.durationPercentageComparison,
          numberOfSolved: entry.numberOfSolved,
          difficultyEntries: topic.difficultyEntries,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [data, mode]);

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)), 10);
  const domainPad = Math.ceil(maxAbs / 5) * 5 + 5;
  const chartHeight = Math.max(rows.length * 36, 144);

  return (
    <AnalyticsCard
      title="Speed vs. Average by Tag"
      description="% faster or slower than your overall average"
      actions={<DifficultyModeSelector value={mode} onChange={setMode} />}
    >
      {rows.length === 0 ? (
        <AnalyticsEmptyState>No tag speed data yet</AnalyticsEmptyState>
      ) : (
        <div
          className="relative min-w-0"
          style={{ height: `${chartHeight}px` }}
        >
          <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="#1d1d1d"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                domain={[-domainPad, domainPad]}
                tickFormatter={(v) => formatPercent(Number(v))}
                tick={{
                  fill: "var(--color-zinc-300)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "monospace",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="tag"
                width={130}
                tick={{
                  fill: "var(--color-zinc-300)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontFamily: "monospace",
                }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine x={0} stroke="#404460" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0]?.payload as
                    | {
                        tag?: string;
                        difficultyEntries?: TopicRadarEntry["difficultyEntries"];
                      }
                    | undefined;
                  const tag = String(row?.tag ?? "");
                  if (!row?.difficultyEntries) return null;

                  return (
                    <DifficultyStatsTooltip
                      title={tag}
                      difficultyEntries={row.difficultyEntries}
                      difficulties={getTooltipDifficulties(mode)}
                      valueLabel="Vs Avg"
                      formatValue={(entry) => (
                        <PaceComparisonValue
                          value={entry.durationPercentageComparison}
                          numberOfSolved={entry.numberOfSolved}
                        />
                      )}
                    />
                  );
                }}
              />
              <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={4}>
                {rows.map((r) => (
                  <Cell
                    key={r.tag}
                    fill={
                      r.value > 0
                        ? "var(--color-neutral-500)"
                        : "var(--color-stone-300)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
