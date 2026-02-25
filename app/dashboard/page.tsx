"use client";

import { useProblemsQuery } from "@/hooks/problems/useProblemsQuery";
import AddProblem from "@/components/problems/AddProblem";
import DashboardMain from "@/components/problems/DashboardMain";
import Stat from "@/components/stat/Stat";

export default function Page() {
  const { data: problems = [], isLoading, isError } = useProblemsQuery();

  if (isError) {
    return <div>Error fetching problems</div>;
  }

  return (
    <div className="flex flex-col md:flex-row-reverse md:justify-between w-full px-4">
      <div className="w-90 mt-5 md:mt-10 flex flex-col md:items-end space-y-5">
        <AddProblem />
        <Stat problems={problems} isLoading={isLoading} className="" />
      </div>
      <DashboardMain
        problems={problems}
        isLoading={isLoading}
        className="mt-5 flex-1"
      />
    </div>
  );
}
