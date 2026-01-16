import { getAverageSolvedDuration } from "../../lib/userStat";
import AverageDurationClient from "./AverageDuration.client";

export default async function AverageDurationServer({
  userId,
}: {
  userId: string;
}) {
  const stats = await getAverageSolvedDuration({ userId });
  return <AverageDurationClient stats={stats} />;
}
