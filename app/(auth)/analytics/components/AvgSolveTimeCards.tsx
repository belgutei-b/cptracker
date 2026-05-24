import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import { formatDuration } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { DifficultyEntries } from "@/types/analytics";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";

type Props = {
  data: DifficultyEntries;
  numberOfDays?: number;
};

type DisplayDifficulty = Exclude<Difficulty, "All">;

const ORDER: DisplayDifficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

function getRangeLabel(numberOfDays: number): string {
  if (numberOfDays === 7) return "previous 7 days";
  if (numberOfDays === 14) return "previous 2 weeks";
  if (numberOfDays === 30) return "previous month";
  return `previous ${numberOfDays} days`;
}

function formatComparison({
  pct,
  numberOfSolved,
  rangeLabel,
}: {
  pct: number;
  numberOfSolved: number;
  rangeLabel: string;
}): {
  label: string;
  tone: "up" | "down" | "flat";
} {
  if (numberOfSolved === 0) {
    return { label: "no solves this period", tone: "flat" };
  }

  if (!Number.isFinite(pct) || pct === 0) {
    return { label: `no change vs ${rangeLabel}`, tone: "flat" };
  }
  const arrow = pct > 0 ? "▲" : "▼";
  const tone = pct > 0 ? "up" : "down";
  const direction = pct > 0 ? "slower" : "faster";
  return {
    label: `${arrow} ${Math.abs(pct).toFixed(1)}% ${direction} vs ${rangeLabel}`,
    tone,
  };
}

export default function AvgSolveTimeCards({ data, numberOfDays = 7 }: Props) {
  const rangeLabel = getRangeLabel(numberOfDays);

  return (
    <AnalyticsCard
      title="Average Solve Time"
      description={`past ${numberOfDays} day · per difficulty`}
      actions={
        <div className="flex items-center gap-4">
          {ORDER.map((label) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: DIFFICULTY_COLORS[label] }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ORDER.map((difficulty) => {
          const entry = data[difficulty];
          const color = DIFFICULTY_COLORS[difficulty];

          const comparison = formatComparison({
            pct: entry?.durationPercentageComparison ?? 0,
            numberOfSolved: entry?.numberOfSolved ?? 0,
            rangeLabel,
          });
          const toneClass =
            comparison.tone === "flat" ? "text-neutral-500" : "";
          const toneColor =
            comparison.tone === "up"
              ? DIFFICULTY_COLORS.Hard
              : comparison.tone === "down"
                ? DIFFICULTY_COLORS.Easy
                : undefined;

          return (
            <div
              key={difficulty}
              className="rounded-xl border border-[#1e1e1e] bg-[#141414] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    {difficulty}
                  </span>
                </div>
                <span className="font-mono text-stone-300 font-semibold text-sm">
                  {entry?.numberOfSolved ?? 0} solved
                </span>
              </div>

              <p
                className="mt-4 font-mono text-3xl font-semibold tracking-tight"
                style={{ color }}
              >
                {formatDuration(entry?.avgSolveDuration ?? 0)}
              </p>

              <p
                className={`mt-2 font-mono text-xs tracking-tight font-medium ${toneClass}`}
                style={{ color: toneColor }}
              >
                {comparison.label}
              </p>
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
}
