import { redirect } from "next/navigation";
import { Suspense } from "react";
import AddProblem from "../../components/AddProblem";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import AverageDurationServer from "../../components/stat/AverageDuration.server";
import ProblemListServer from "../../components/problems/ProblemList.server";

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
      </div>
      <div className="w-full lg:w-5/8 mt-5">
        <div className="text-lg text-white font-bold mb-5">My Dashboard</div>
        <Suspense fallback={<div>Loading.......</div>}>
          <ProblemListServer userId={userId} />
        </Suspense>
        <Suspense fallback={<div>Loading.....</div>}>
          <AverageDurationServer userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}
