import TotalTimeBarChart from "@/components/analytics/TotalTimeBarChart";
import { Difficulty } from "@/prisma/generated/prisma/enums";
import type {
  BarChartColumn,
  DifficultyEntries,
  DifficultyEntry,
} from "@/types/analytics";

function createDifficultyEntry({
  difficulty,
  duration,
  numberOfSolved,
}: {
  difficulty: Difficulty;
  duration: number;
  numberOfSolved: number;
}): DifficultyEntry {
  return {
    difficulty,
    duration,
    avgSolveDuration: numberOfSolved > 0 ? duration / numberOfSolved : 0,
    numberOfSolved,
    durationPercentageComparison: 0,
  };
}

function createLandingChartColumn({
  date,
  easyDuration,
  mediumDuration,
  hardDuration,
  easySolved,
  mediumSolved,
  hardSolved,
}: {
  date: string;
  easyDuration: number;
  mediumDuration: number;
  hardDuration: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}): BarChartColumn {
  const totalDuration = easyDuration + mediumDuration + hardDuration;
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const difficultyEntries: DifficultyEntries = {
    [Difficulty.Easy]: createDifficultyEntry({
      difficulty: Difficulty.Easy,
      duration: easyDuration,
      numberOfSolved: easySolved,
    }),
    [Difficulty.Medium]: createDifficultyEntry({
      difficulty: Difficulty.Medium,
      duration: mediumDuration,
      numberOfSolved: mediumSolved,
    }),
    [Difficulty.Hard]: createDifficultyEntry({
      difficulty: Difficulty.Hard,
      duration: hardDuration,
      numberOfSolved: hardSolved,
    }),
    [Difficulty.All]: createDifficultyEntry({
      difficulty: Difficulty.All,
      duration: totalDuration,
      numberOfSolved: totalSolved,
    }),
  };

  return { date, difficultyEntries };
}

const landingChartData: BarChartColumn[] = [
  createLandingChartColumn({
    date: "Mon",
    easyDuration: 0,
    mediumDuration: 0,
    hardDuration: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  }),
  createLandingChartColumn({
    date: "Tue",
    easyDuration: 1800,
    mediumDuration: 2700,
    hardDuration: 0,
    easySolved: 1,
    mediumSolved: 2,
    hardSolved: 0,
  }),
  createLandingChartColumn({
    date: "Wed",
    easyDuration: 900,
    mediumDuration: 0,
    hardDuration: 4500,
    easySolved: 1,
    mediumSolved: 0,
    hardSolved: 1,
  }),
  createLandingChartColumn({
    date: "Thu",
    easyDuration: 1200,
    mediumDuration: 3600,
    hardDuration: 0,
    easySolved: 2,
    mediumSolved: 2,
    hardSolved: 0,
  }),
  createLandingChartColumn({
    date: "Fri",
    easyDuration: 600,
    mediumDuration: 1800,
    hardDuration: 5400,
    easySolved: 1,
    mediumSolved: 1,
    hardSolved: 1,
  }),
  createLandingChartColumn({
    date: "Sat",
    easyDuration: 2400,
    mediumDuration: 4200,
    hardDuration: 3600,
    easySolved: 2,
    mediumSolved: 3,
    hardSolved: 1,
  }),
  createLandingChartColumn({
    date: "Sun",
    easyDuration: 1500,
    mediumDuration: 2100,
    hardDuration: 0,
    easySolved: 1,
    mediumSolved: 2,
    hardSolved: 0,
  }),
];

export default function LandingTotalTimeBarChart() {
  return (
    <TotalTimeBarChart
      numberOfDays={7}
      chartData={landingChartData}
      isLoading={false}
    />
  );
}
