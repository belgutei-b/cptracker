import { getUserStats } from "../../lib/userStat";
import AverageDuration from "./AverageDuration";
import DifficultyRatio from "./DifficultyRatio";

export default async function StatServer({ userId }: { userId: string }) {
  const stats = await getUserStats({ userId });
  return (
    <div className="space-y-6">
      <AverageDuration stats={stats} />
      <DifficultyRatio stats={stats} />
    </div>
  );
}
