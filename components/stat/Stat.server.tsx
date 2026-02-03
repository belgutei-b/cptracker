import { getUserStats } from "@/lib/userStat";
import AverageDuration from "@/components/stat/AverageDuration";
import BoxStats from "./BoxStats";
import DifficultyRatio from "./DifficultyRatio";

export default async function StatServer({ userId }: { userId: string }) {
  const stats = await getUserStats({ userId });
  return (
    <div className="space-y-6">
      <BoxStats stats={stats} />
      <AverageDuration stats={stats} />
      <DifficultyRatio stats={stats} />
    </div>
  );
}
