"use client";

import Link from "next/link";
import { CheckCircle, ExternalLink, Clock, Play } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProblemSolving from "@/components/ProblemSolving";
import type { UserProblemFullClient } from "@/types/client";
import { useNowTick, getDisplayedSeconds, formatMMSS } from "@/lib/timer";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDateForCard(dateValue?: string | null) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

function getDisplayDate(problem: UserProblemFullClient) {
  if (problem.status === "SOLVED") {
    return problem.solvedAt ?? problem.updatedAt ?? problem.createdAt;
  }

  if (problem.status === "IN_PROGRESS" || problem.status === "TRIED") {
    return (
      problem.lastStartedAt ??
      problem.lastBeatAt ??
      problem.updatedAt ??
      problem.createdAt
    );
  }

  return problem.createdAt;
}

export default function ProblemListClient({
  receivedProblems,
  filters = { difficulty: "all", status: "all" },
}: {
  receivedProblems: UserProblemFullClient[];
  filters?: {
    difficulty: string;
    status: string;
  };
}) {
  const [problems, setProblems] =
    useState<UserProblemFullClient[]>(receivedProblems);
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const openProblemId = searchParams.get("openProblemId");

  const activeProblem = useMemo(
    () => problems.find((p) => p.problemId === activeProblemId) ?? null,
    [problems, activeProblemId],
  );
  const difficultyFilter = filters.difficulty ?? "all";
  const statusFilter = filters.status ?? "all";
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesDifficulty =
        difficultyFilter === "all" ||
        p.problem.difficulty.toLowerCase() === difficultyFilter;
      const normalizedStatus = p.status.toLowerCase().replace("_", "-");
      const matchesStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;
      return matchesDifficulty && matchesStatus;
    });
  }, [problems, difficultyFilter, statusFilter]);

  const anyRunning = problems.some(
    (p) => p.status === "IN_PROGRESS" && p.lastStartedAt,
  );
  const nowMs = useNowTick(isClient && anyRunning);
  const displayNowMs = isClient ? nowMs : 0;

  useEffect(() => {
    setProblems(receivedProblems);
  }, [receivedProblems]);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!openProblemId) return;
    const exists = problems.some((p) => p.problemId === openProblemId);
    if (!exists) return;
    setActiveProblemId(openProblemId);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("openProblemId");
    const next = params.toString();
    router.replace(next ? `/dashboard?${next}` : "/dashboard");
  }, [openProblemId, problems, router, searchParams]);

  function onNoteLocalChange(problemId: string, note: string) {
    setProblems((prev) =>
      prev.map((p) => (p.problemId === problemId ? { ...p, note } : p)),
    );
  }

  function onFinishLocalAction(
    problemId: string,
    newStatus: "TRIED" | "SOLVED",
    duration?: number | null,
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
          : p,
      ),
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
          : p,
      ),
    );

    // Call the start endpoint (recommended)
    await fetch(`/api/problems/${problemId}/start`, { method: "POST" });
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
        {filteredProblems.map((problem) => {
          const displayDate = formatDateForCard(getDisplayDate(problem));

          return (
            <div
              key={problem.problemId}
              className="border border-[#3e3e3e] bg-[#282828] rounded-xl p-4 w-full flex flex-col justify-between"
            >
              {/* UPPER PART  */}
              <div>
                {/* Difficulty | Duration */}
                <div className="flex justify-between mb-2">
                  {/* Difficulty | left side */}
                  <div className="flex items-center gap-1.5">
                    <p
                      className="text-xs font-bold tracking-wider uppercase"
                      style={{
                        color: DIFFICULTY_COLORS[problem.problem.difficulty],
                      }}
                    >
                      {problem.problem.difficulty}
                    </p>
                    <CheckCircle
                      size={16}
                      style={{
                        color: DIFFICULTY_COLORS[problem.problem.difficulty],
                      }}
                    />
                  </div>
                  {/* Duration | right side */}
                  <div className="flex items-center text-xs font-mono text-gray-400">
                    <Clock size={12} className="mr-1.5" />
                    <p className="tracking-tighter">
                      {formatMMSS(getDisplayedSeconds(problem, displayNowMs))}
                    </p>
                  </div>
                </div>

                {/* Title & Problem link */}
                <div className="text-base font-semibold flex gap-2 text-white">
                  <p>
                    {problem.problem.questionId}. {problem.problem.title}
                  </p>
                  <Link
                    href={problem.problem.link}
                    target="_blank"
                    className="text-gray-500 hover:text-white transition-colors mt-1"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>

                {/* Topics */}
                <div className="flex gap-2 flex-wrap my-3">
                  {problem.status === "SOLVED" ? (
                    problem.problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#3e3e3e] text-[10px] text-gray-300"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#3e3e3e] text-[10px] text-gray-300">
                      topics hidden
                    </span>
                  )}
                </div>
              </div>

              {/* BOTTOM PART */}
              <div className="w-full items-center flex justify-between border-t pt-3 border-[#3e3e3e]">
                <button
                  onClick={() => startProblem(problem.problemId)}
                  className="p-2 rounded-lg transition-all text-white bg-[#3e3e3e] hover:bg-[#4e4e4e]"
                >
                  <Play size={18} />
                </button>

                <div className="flex flex-col items-end">
                  <div className="text-xs text-white font-semibold uppercase">
                    {problem.status}
                  </div>
                  <div className="text-[11px] text-gray-400">{displayDate}</div>
                </div>
              </div>
            </div>
          );
        })}
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
