import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
// components
import AddProblem from "@/components/AddProblem";
import AverageDurationServer from "@/components/stat/AverageDuration.server";
import AverageDurationSkeleton from "@/components/stat/AverageDurationSkeleton";
import ProblemListServer from "@/components/problems/ProblemList.server";
import ProblemListSkeleton from "@/components/problems/ProblemListSkeleton";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  const userId = session.user.id;

  return (
    <div className="w-full flex flex-col lg:flex-row-reverse px-4 gap-3">
      <div className="flex-1 mt-5 md:mt-10">
        <AddProblem />
        <Suspense fallback={<AverageDurationSkeleton />}>
          <AverageDurationServer userId={userId} />
        </Suspense>
      </div>
      <div className="w-full lg:w-5/8 mt-5">
        <div className="text-lg text-white font-bold mb-5">My Dashboard</div>
        <div>
          <Suspense fallback={<ProblemListSkeleton />}>
            <ProblemListServer userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
