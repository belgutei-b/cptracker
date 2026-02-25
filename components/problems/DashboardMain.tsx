"use client";

import { useState } from "react";
import ProblemList from "@/components/problems/ProblemList";
import ProblemListSkeleton from "@/components/problems/ProblemListSkeleton";
import { UserProblemFullClient } from "@/types/client";

export default function DashboardMain({
  problems,
  className,
  isLoading,
}: {
  problems: UserProblemFullClient[];
  className?: string;
  isLoading: boolean;
}) {
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  return (
    <div className={["flex flex-col", className].filter(Boolean).join(" ")}>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xl text-white font-bold mb-1">My Dashboard</div>
          <div className="text-gray-400 mb-5">
            Keep track of your leetcode progress and efficiency.
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <select
              id="difficulty-filter"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-[#1f1f1f] border border-[#3e3e3e] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#1f1f1f] border border-[#3e3e3e] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="solved">Solved</option>
              <option value="tried">Tried</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <ProblemListSkeleton />
      ) : (
        <ProblemList problems={problems} filters={{ difficulty, status }} />
      )}
    </div>
  );
}
