"use client";

import Link from "next/link";
import { CheckCircle, ExternalLink, Clock, Play } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import ProblemSolving from "../ProblemSolving";
import type { UserProblemFullClient } from "../../types/client";
import { useNowTick, getDisplayedSeconds, formatMMSS } from "../../lib/timer";
import { DIFFICULTY_COLORS } from "../stat/AverageDuration";

export default function ProblemListClient({
  receivedProblems,
}: {
  receivedProblems: UserProblemFullClient[];
}) {
  const [problems, setProblems] =
    useState<UserProblemFullClient[]>(receivedProblems);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const activeProblem = useMemo(
    () => problems.find((p) => p.problemId === activeProblemId) ?? null,
    [problems, activeProblemId]
  );

  const anyRunning = problems.some(
    (p) => p.status === "IN_PROGRESS" && p.lastStartedAt
  );
  const nowMs = useNowTick(isClient && anyRunning);
  const displayNowMs = isClient ? nowMs : 0;

  useEffect(() => {
    setProblems(receivedProblems);
  }, [receivedProblems]);
  useEffect(() => {
    setIsClient(true);
  }, []);

  function onNoteLocalChange(problemId: string, note: string) {
    setProblems((prev) =>
      prev.map((p) => (p.problemId === problemId ? { ...p, note } : p))
    );
  }

  function onFinishLocalAction(
    problemId: string,
    newStatus: "TRIED" | "SOLVED",
    duration?: number | null
  ) {
    setProblems((prev) =>
      prev.map((p) =>
        p.problemId === problemId
          ? {
              ...p,
              status: newStatus,
              lastStartedAt: null,
              ...(typeof duration === "number" ? { duration } : {}),
            }
          : p
      )
    );
  }

  async function startProblem(problemId: string) {
    const existing = problems.find((p) => p.problemId === problemId);

    // Always open the modal
    setActiveProblemId(problemId);

    // If already running, DO NOT call /start
    if (existing?.status === "IN_PROGRESS" && existing.lastStartedAt) return;
    if (existing?.status === "SOLVED") return;

    const startedAtIso = new Date().toISOString();

    // optimistic update
    setProblems((prev) =>
      prev.map((p) =>
        p.problemId === problemId
          ? { ...p, status: "IN_PROGRESS", lastStartedAt: startedAtIso }
          : p
      )
    );

    // Call the start endpoint (recommended)
    await fetch(`/api/problems/${problemId}/start`, { method: "POST" });
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {problems.map((problem) => (
          <div
            key={problem.problemId}
            className="border border-[#3e3e3e] bg-[#282828] rounded-xl p-4 w-90"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="w-60">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-emerald-500 text-xs font-bold tracking-wider uppercase"
                    style={{
                      color: DIFFICULTY_COLORS[problem.problem.difficulty],
                    }}
                  >
                    {problem.problem.difficulty}
                  </span>
                  <CheckCircle
                    size={16}
                    style={{
                      color: DIFFICULTY_COLORS[problem.problem.difficulty],
                    }}
                  />
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

              <div className="w-30 flex flex-col items-end">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  Total Spent
                </div>

                <div className="text-sm font-mono text-amber-500">
                  {formatMMSS(getDisplayedSeconds(problem, displayNowMs))}
                </div>
              </div>
            </div>

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

            <div className="w-full items-center flex justify-between border-t pt-3 border-[#3e3e3e]">
              <div className="relative group">
                <button
                  onClick={() => startProblem(problem.problemId)}
                  className="p-2 rounded-lg transition-all text-white bg-[#3e3e3e] hover:bg-[#4e4e4e]"
                >
                  <Play size={18} />
                </button>
                {problem.status === "TODO" && (
                  <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Start solving
                  </div>
                )}
              </div>

              <div className="text-sm text-white font-semibold">
                {problem.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProblemSolving
        open={activeProblem !== null}
        onCloseAction={() => setActiveProblemId(null)}
        problem={activeProblem}
        nowMs={nowMs}
        onNoteLocalChangeAction={onNoteLocalChange}
        onFinishLocalAction={onFinishLocalAction}
      />
    </>
  );
}
