import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
// components
import AddProblem from "@/components/AddProblem";
import StatServer from "@/components/stat/Stat.server";
import StatSkeloton from "@/components/stat/StatSkeloton";
import DashboardMain from "@/components/DashboardMain";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth");
  }
  const userId = session.user.id;

  return (
    <div className="w-full flex flex-col md:flex-row-reverse px-4">
      <div className="w-90 mt-5 md:mt-10 space-y-5 flex flex-col md:items-end">
        <AddProblem />
        <Suspense fallback={<StatSkeloton />}>
          <StatServer userId={userId} />
        </Suspense>
      </div>
      <div className="flex-1 mt-5">
        <DashboardMain />
      </div>
    </div>
  );
}
