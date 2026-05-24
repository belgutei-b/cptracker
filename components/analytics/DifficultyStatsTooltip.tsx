import type { ReactNode } from "react";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import { formatDurationMinutes } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { DifficultyEntries, DifficultyEntry } from "@/types/analytics";
import AnalyticsTooltip from "./AnalyticsTooltip";

type Props = {
  title: string;
  difficultyEntries: DifficultyEntries;
  difficulties: Difficulty[];
  valueLabel?: string;
  formatValue?: (entry: DifficultyEntry) => ReactNode;
};

export default function DifficultyStatsTooltip({
  title,
  difficultyEntries,
  difficulties,
  valueLabel = "Avg",
  formatValue = (entry) => formatDurationMinutes(entry.avgSolveDuration),
}: Props) {
  return (
    <AnalyticsTooltip className="min-w-64">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium text-zinc-300">{title}</p>
      </div>
      <div className="grid grid-cols-[72px_64px_72px] gap-3 border-b border-[#242424] pb-1 font-semibold leading-[1.7] text-[10px] uppercase tracking-widest text-zinc-500">
        <span>Level</span>
        <span className="text-right">Solved</span>
        <span className="text-right">{valueLabel}</span>
      </div>
      {difficulties.map((difficulty) => {
        const entry = difficultyEntries[difficulty];

        return (
          <div
            key={difficulty}
            className="grid grid-cols-[72px_64px_72px] gap-3 leading-[1.7] font-semibold"
          >
            <p
              style={{
                color:
                  difficulty === Difficulty.All
                    ? "var(--color-zinc-300)"
                    : COLORS[difficulty],
              }}
            >
              {difficulty}
            </p>
            <p className="text-right text-zinc-300">{entry.numberOfSolved}</p>
            <p className="text-right text-zinc-300">{formatValue(entry)}</p>
          </div>
        );
      })}
    </AnalyticsTooltip>
  );
}
