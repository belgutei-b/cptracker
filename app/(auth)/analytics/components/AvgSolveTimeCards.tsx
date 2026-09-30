import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import SolveTimeChange from "@/components/analytics/SolveTimeChange";
import { DifficultyText } from "@/components/problems/ProblemLabels";
import { DIFFICULTIES } from "@/constants/difficulty";
import { formatDuration } from "@/lib/date";
import type { DifficultyEntries } from "@/types/analytics";

type Props = {
  data: DifficultyEntries;
  numberOfDays: number;
};

export default function AvgSolveTimeCards({ data, numberOfDays }: Props) {
  return (
    <AnalyticsCard
      title="Average solve time by difficulty"
      description={`Solved problems in the last ${numberOfDays} days, compared with the ${numberOfDays} days before`}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {DIFFICULTIES.map((difficulty) => {
          const entry = data[difficulty];

          return (
            <div key={difficulty} className="flex flex-col gap-3 rounded-lg border px-4 py-4 md:px-5">
              <div className="flex items-baseline justify-between">
                <DifficultyText difficulty={difficulty} className="text-sm" />
                <span className="font-mono text-[13px] text-muted-foreground">
                  {entry.numberOfSolved} solved
                </span>
              </div>
              <span className="font-mono text-3xl leading-none font-medium tracking-tight">
                {entry.numberOfSolved > 0 ? formatDuration(Math.round(entry.avgSolveDuration)) : "—"}
              </span>
              <SolveTimeChange
                percent={entry.durationPercentageComparison}
                numberOfSolved={entry.numberOfSolved}
                previousLabel="previous period"
                className="text-[13px]"
              />
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
}
