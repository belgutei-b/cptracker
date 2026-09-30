import type { ReactNode } from "react";
import { DifficultyText } from "@/components/problems/ProblemLabels";
import { formatDurationMinutes } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { ProblemDifficulty } from "@/constants/difficulty";
import type { DifficultyEntries, DifficultyEntry } from "@/types/analytics";
import AnalyticsTooltip from "./AnalyticsTooltip";

type Props = {
  title: string;
  difficultyEntries: DifficultyEntries;
  difficulties: Difficulty[];
  valueLabel?: string;
  formatValue?: (entry: DifficultyEntry) => ReactNode;
};

/** chart tooltip: solved count and one value per difficulty */
export default function DifficultyStatsTooltip({
  title,
  difficultyEntries,
  difficulties,
  valueLabel = "Avg",
  formatValue = (entry) => formatDurationMinutes(entry.avgSolveDuration),
}: Props) {
  return (
    <AnalyticsTooltip className="min-w-60">
      <p className="mb-2 text-[13px] font-medium">{title}</p>
      <div className="grid grid-cols-[72px_56px_72px] gap-x-3 border-b pb-1 text-muted-foreground">
        <span>Level</span>
        <span className="text-right">Solved</span>
        <span className="text-right">{valueLabel}</span>
      </div>
      {difficulties.map((difficulty) => {
        const entry = difficultyEntries[difficulty];

        return (
          <div key={difficulty} className="grid grid-cols-[72px_56px_72px] gap-x-3 pt-1">
            {difficulty === Difficulty.All ? (
              <span className="font-medium">All</span>
            ) : (
              <DifficultyText difficulty={difficulty as ProblemDifficulty} />
            )}
            <span className="text-right font-mono">{entry.numberOfSolved}</span>
            <span className="text-right font-mono">{formatValue(entry)}</span>
          </div>
        );
      })}
    </AnalyticsTooltip>
  );
}
