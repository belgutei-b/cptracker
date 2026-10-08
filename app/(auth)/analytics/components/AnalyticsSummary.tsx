import type { ReactNode } from "react";
import { CalendarCheck, CircleCheck, Clock, Timer } from "lucide-react";

import SolveTimeChange from "@/components/analytics/SolveTimeChange";
import { formatDuration } from "@/lib/date";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { BarChartColumn, DifficultyEntries } from "@/types/analytics";

type Props = {
  dailyBarChart: BarChartColumn[];
  avgSolveTime: DifficultyEntries;
  numberOfDays: number;
};

/** four headline numbers for the selected range */
export default function AnalyticsSummary({ dailyBarChart, avgSolveTime, numberOfDays }: Props) {
  const days = dailyBarChart.map((day) => day.difficultyEntries[Difficulty.All]);
  const practicedSeconds = days.reduce((sum, day) => sum + day.duration, 0);
  const activeDays = days.filter((day) => day.duration > 0 || day.numberOfSolved > 0).length;
  const overall = avgSolveTime[Difficulty.All];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <StatTile
        icon={<Clock />}
        label="Time practiced"
        value={practicedSeconds > 0 ? formatDuration(practicedSeconds) : "—"}
        detail="Tried and solved sessions"
      />
      <StatTile
        icon={<CircleCheck />}
        label="Solved"
        value={overall.numberOfSolved}
        detail={`In the last ${numberOfDays} days`}
      />
      <StatTile
        icon={<CalendarCheck />}
        label="Active days"
        value={
          <>
            {activeDays}
            <span className="text-lg text-muted-foreground"> / {numberOfDays}</span>
          </>
        }
        detail="Days with any practice"
      />
      <StatTile
        icon={<Timer />}
        label="Average solve time"
        value={overall.numberOfSolved > 0 ? formatDuration(Math.round(overall.avgSolveDuration)) : "—"}
        detail={
          <SolveTimeChange
            percent={overall.durationPercentageComparison}
            numberOfSolved={overall.numberOfSolved}
            previousLabel={`previous ${numberOfDays} days`}
          />
        }
      />
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  detail: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border bg-card px-4 py-4 md:px-5">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground [&_svg]:size-3.5">
        {icon}
        {label}
      </div>
      <div className="font-mono text-2xl leading-none font-medium tracking-tight md:text-[28px]">
        {value}
      </div>
      <div className="text-[13px] text-muted-foreground">{detail}</div>
    </div>
  );
}
