"use client";

import Link from "next/link";
import { UserProblemFull } from "../types";
import { CheckCircle, ExternalLink, Clock, Play } from "lucide-react";

export default function DashboardProblems({
  problems,
}: {
  problems: UserProblemFull[];
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {problems.map((problem) => {
        return (
          <div
            key={problem.problemId}
            className="border border-[#3e3e3e] bg-[#282828] rounded-xl p-4 w-90"
          >
            <div className="flex justify-between items-start mb-2">
              {/* difficulty & title */}
              <div className="w-60">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-emerald-500 text-xs font-bold tracking-wider uppercase">
                    {problem.problem.difficulty}
                  </span>
                  <CheckCircle size={16} className="text-[#00af9b]" />
                </div>
                <div className="text-lg font-semibold flex items-center gap-2 text-white">
                  {problem.problem.title}
                  <Link
                    href={problem.problem.link}
                    target="_blank"
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
              {/* Time */}
              <div className="w-30 flex flex-col items-end">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  Total Spent
                </div>
                <div className="text-sm font-mono text-amber-500">15m 0s</div>
              </div>
            </div>

            {/* tags */}
            <div>
              <div className="flex gap-2 flex-wrap my-3">
                {problem.problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-[#3e3e3e] text-[10px] text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full items-center flex justify-between border-t pt-3 border-[#3e3e3e]">
              <button
                className={`p-2 rounded-lg transition-all text-white bg-[#3e3e3e] hover:bg-[#4e4e4e]`}
              >
                <Play size={18} />
              </button>

              <div className={`text-sm text-white font-semibold`}>
                {problem.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
