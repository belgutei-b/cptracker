"use client";

import { useProblemsQuery } from "@/hooks/problems/useProblemsQuery";
import AddProblem from "@/components/problems/AddProblem";
import DashboardMain from "@/components/problems/DashboardMain";
import Stat from "@/components/stat/Stat";
import { useEffect } from "react";

export default function Page() {
  const { data, isLoading, isError } = useProblemsQuery();
  const { problems = [], timezone = "UTC" } = data ?? {};

  useEffect(() => {
    async function fetchRequest(timezone: string) {
      const res = await fetch("/api/timezone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timezone,
        }),
      });

      /* If request succeed, store the last time that timezone stored */
      if (res.ok) {
        localStorage.setItem("tz", timezone);
      }
    }

    const storedTz = localStorage.getItem("tz");
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!storedTz || storedTz !== currentTz) {
      // Source - https://stackoverflow.com/a/37512371
      fetchRequest(currentTz);
    }
  }, []);

  if (isError) {
    return <div>Error fetching problems</div>;
  }

  return (
    <div className="flex flex-col md:flex-row-reverse md:justify-between w-full px-4">
      <div className="w-90 mt-5 md:mt-10 flex flex-col md:items-end space-y-5">
        <AddProblem />
        <Stat
          problems={problems}
          timezone={timezone}
          isLoading={isLoading}
          className=""
        />
      </div>
      <DashboardMain
        problems={problems}
        timezone={timezone}
        isLoading={isLoading}
        className="mt-5 flex-1"
      />
    </div>
  );
}
