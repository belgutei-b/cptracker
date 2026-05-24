import type { BarChartColumn } from "@/types/analytics";
import type { AnalyticsRangeDays } from "@/constants/analytics";
import TotalTimeBarChart from "@/components/analytics/TotalTimeBarChart";

type Props = {
  data: BarChartColumn[];
  numberOfDays: AnalyticsRangeDays;
};

export default function DailyTotalTimeBarChart({ data, numberOfDays }: Props) {
  return (
    <TotalTimeBarChart
      numberOfDays={numberOfDays}
      chartData={data}
      isLoading={false}
      variant="dark"
    />
  );
}
