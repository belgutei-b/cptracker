import { Difficulty } from "@/prisma/generated/prisma/enums";
import type { BarChartColumn } from "@/lib/userStat";
import type { BarChartData } from "@/types/stat";
import type { AnalyticsRangeDays } from "@/constants/analytics";
import TotalTimeBarChart from "@/components/analytics/TotalTimeBarChart";

type Props = {
  data: BarChartColumn[];
  numberOfDays: AnalyticsRangeDays;
};

function toBarChartData(columns: BarChartColumn[]): BarChartData[] {
  return columns.map((col) => {
    const get = (d: Difficulty) =>
      col.entries.find((e) => e.difficulty === d) ?? {
        duration: 0,
        numberOfSolved: 0,
      };
    const easy = get(Difficulty.Easy);
    const medium = get(Difficulty.Medium);
    const hard = get(Difficulty.Hard);

    return {
      date: col.date,
      easy: easy.duration,
      medium: medium.duration,
      hard: hard.duration,
      problemCount:
        easy.numberOfSolved + medium.numberOfSolved + hard.numberOfSolved,
    };
  });
}

export default function DailyTotalTimeBarChart({ data, numberOfDays }: Props) {
  return (
    <TotalTimeBarChart
      numberOfDays={numberOfDays}
      chartData={toBarChartData(data)}
      isLoading={false}
      variant="dark"
    />
  );
}
