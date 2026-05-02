import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { AvgSolveTime } from "@/lib/userStat";

type Props = {
  data: AvgSolveTime[];
  numberOfDays?: number;
};

const ORDER: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatComparison(pct: number): {
  label: string;
  tone: "up" | "down" | "flat";
} {
  if (!Number.isFinite(pct) || pct === 0) {
    return { label: "no change vs last week", tone: "flat" };
  }
  const arrow = pct > 0 ? "▲" : "▼";
  const tone = pct > 0 ? "up" : "down";
  return {
    label: `${arrow} ${Math.abs(pct).toFixed(1)}% vs last week`,
    tone,
  };
}

export default function AvgSolveTimeCards({ data, numberOfDays = 7 }: Props) {
  const byDifficulty = new Map(data.map((d) => [d.difficulty, d]));

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">
            Average Solve Time
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-600">
            past {numberOfDays} days · per difficulty
          </p>
        </div>

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
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ORDER.map((difficulty) => {
          const entry = byDifficulty.get(difficulty);
          const color = DIFFICULTY_COLORS[difficulty];
          const avg =
            entry && entry.numberOfSolved > 0
              ? entry.duration / entry.numberOfSolved
              : 0;
          const comparison = formatComparison(entry?.comparisonToLastWeek ?? 0);
          const toneClass =
            comparison.tone === "up"
              ? "text-rose-400"
              : comparison.tone === "down"
                ? "text-emerald-400"
                : "text-neutral-500";

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
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                    {difficulty}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">
                  {entry?.numberOfSolved ?? 0} solved
                </span>
              </div>

              <p
                className="mt-4 font-mono text-3xl font-semibold tracking-tight"
                style={{ color }}
              >
                {formatSeconds(avg)}
              </p>

              <p
                className={`mt-2 font-mono text-[11px] tracking-tight ${toneClass}`}
              >
                {comparison.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
