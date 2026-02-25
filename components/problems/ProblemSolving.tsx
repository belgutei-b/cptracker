"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle, X } from "lucide-react";

import { getDisplayedMilliseconds, useNowTick } from "@/lib/timer";
import { DIFFICULTY_COLORS } from "@/constants/difficulty";
import type { UserProblemFullClient } from "@/types/client";
import { useFinishProblemMutation } from "@/hooks/problems/useFinishProblemMutation";
import { useSaveProblemMutation } from "@/hooks/problems/useSaveProblemMutation";

const timerFont = localFont({
  src: [
    {
      path: "../../public/timerfont/font-timer.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

function formatProblemTimer(totalMs: number) {
  const safeMs = Math.max(0, Math.floor(totalMs));
  const safeSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const centiseconds = Math.floor((safeMs % 1000) / 10);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const xx = String(centiseconds).padStart(2, "0");

  return { main: `${hh}:${mm}:${ss}`, centiseconds: xx };
}

export default function ProblemSolving({
  open,
  onCloseAction,
  problem,
  nowMs,
}: {
  open: boolean;
  onCloseAction: () => void;
  problem: UserProblemFullClient | null;
  nowMs: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCloseAction]);

  if (!open || !problem) return null;

  return (
    <ProblemSolvingContent
      key={problem.problemId}
      problem={problem}
      nowMs={nowMs}
      onCloseAction={onCloseAction}
    />
  );
}

function ProblemSolvingContent({
  problem,
  nowMs,
  onCloseAction,
}: {
  problem: UserProblemFullClient;
  nowMs: number;
  onCloseAction: () => void;
}) {
  const [note, setNote] = useState(problem.note ?? "");
  const [timeComplexity, setTimeComplexity] = useState(
    problem.timeComplexity ?? "",
  );
  const [spaceComplexity, setSpaceComplexity] = useState(
    problem.spaceComplexity ?? "",
  );
  const finishMutation = useFinishProblemMutation();
  const saveMutation = useSaveProblemMutation();

  async function handleFinish({ isSolved }: { isSolved: boolean }) {
    await finishMutation.mutateAsync({
      problemId: problem.problemId,
      newStatus: isSolved ? "SOLVED" : "TRIED",
      note,
      timeComplexity,
      spaceComplexity,
    });
  }

  async function handleSave() {
    await saveMutation.mutateAsync({
      problemId: problem.problemId,
      note,
      timeComplexity,
      spaceComplexity,
    });
  }

  const isTimerRunning =
    problem.status === "IN_PROGRESS" && !!problem.lastStartedAt;
  const liveNowMs = useNowTick(isTimerRunning, 10);
  const displayedMilliseconds = getDisplayedMilliseconds(
    problem,
    isTimerRunning ? liveNowMs : nowMs,
  );
  const formattedTimer = formatProblemTimer(displayedMilliseconds);
  const canSave = problem.status === "SOLVED";
  const isDirty =
    note !== (problem.note ?? "") ||
    timeComplexity !== (problem.timeComplexity ?? "") ||
    spaceComplexity !== (problem.spaceComplexity ?? "");
  const isFinishing = finishMutation.isPending;
  const isSaving = saveMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Problem modal for ${problem.problem.title}`}
    >
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onCloseAction}
        aria-label="Close modal"
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#3e3e3e] bg-[#282828] shadow-xl">
        <div className="flex items-start justify-between gap-4 px-4 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold tracking-wider uppercase"
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

            <div className="mt-1 flex items-center gap-2 text-xl font-semibold text-white">
              {problem.problem.title}
              <Link
                href={problem.problem.link}
                target="_blank"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
              </Link>
            </div>

            {problem.status === "SOLVED" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {problem.problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-[#3e3e3e] text-[10px] text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Timer | horizontal line */}
        <div className="border-b border-[#3e3e3e] w-full flex justify-center text-6xl  text-[#ffa116] py-3">
          <div>
            <span className={timerFont.className}>
              {formattedTimer.main}
              <span className="text-2xl">.{formattedTimer.centiseconds}</span>
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-stone-300">
              Status:{" "}
              <span className="text-white font-semibold">{problem.status}</span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Time Complexity
              </label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="w-full rounded-lg border border-[#3e3e3e] bg-[#1f1f1f] px-3 py-2 text-sm text-gray-200 placeholder:text-stone-600"
                placeholder="O(n log n)"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Space Complexity
              </label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="w-full rounded-lg border border-[#3e3e3e] bg-[#1f1f1f] px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600"
                placeholder="O(1)"
              />
            </div>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="text-sm rounded-xl border border-[#3e3e3e] bg-[#1f1f1f] p-2 text-gray-200 w-full h-40"
          />
        </div>

        {(problem.status !== "SOLVED" || canSave) && (
          <div className="border-t border-[#3e3e3e] flex items-center justify-end gap-2 p-4">
            {problem.status !== "SOLVED" && (
              <>
                <button
                  onClick={() => handleFinish({ isSolved: false })}
                  disabled={isFinishing || isSaving}
                  className="border border-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tried
                </button>
                <button
                  onClick={() => handleFinish({ isSolved: true })}
                  disabled={isFinishing || isSaving}
                  className="border border-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-emerald-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Solved
                </button>
              </>
            )}
            {canSave && (
              <button
                onClick={handleSave}
                disabled={!isDirty || isSaving || isFinishing}
                className="border border-[#3e3e3e] rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Updating..." : "Update notes"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
