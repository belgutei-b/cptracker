import { getAverageSolvedDuration } from "../../lib/userStat";
import { Suspense } from "react";
import AverageDurationClient from "./AverageDuration.client";

export default async function AverageDurationServer({
  userId,
}: {
  userId: string;
}) {
  const stats = await getAverageSolvedDuration({ userId });
  return (
    <div>
      <Suspense>
        <AverageDurationClient stats={stats} />
      </Suspense>
    </div>
  );
}
