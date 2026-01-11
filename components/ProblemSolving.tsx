// components/ProblemSolving.tsx
"use client";

import type { UserProblemFullClient } from "../types/client";
import { getDisplayedSeconds, formatMMSS } from "../lib/timer";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle, X, Timer } from "lucide-react";

export default function ProblemSolving({
  open,
  onClose,
  problem,
  nowMs,
  onNoteLocalChange,
}: {
  open: boolean;
  onClose: () => void;
  problem: UserProblemFullClient | null;
  nowMs: number;
  onNoteLocalChange: (problemId: string, note: string) => void;
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const [note, setNote] = useState("");

  // Initialize note when opening / switching problems
  useEffect(() => {
    if (!open || !problem) return;
    setNote(problem.note ?? "");
  }, [open, problem?.problemId]);

  // Track last note successfully sent
  const lastSentNoteRef = useRef<string>("");

  // Reset lastSent when problem changes
  useEffect(() => {
    if (!problem) return;
    lastSentNoteRef.current = problem.note ?? "";
  }, [problem?.problemId]);

  // Heartbeat every 30s ONLY when running
  useEffect(() => {
    if (!open || !problem) return;
    if (!(problem.status === "IN_PROGRESS" && problem.lastStartedAt)) return;

    let cancelled = false;

    async function sendBeat() {
      if (cancelled) return;

      const noteChanged = note !== lastSentNoteRef.current;
      const payload = noteChanged ? { note } : {};

      try {
        await fetch(`/api/problems/${problem!.problemId}/beat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (noteChanged) lastSentNoteRef.current = note;
      } catch {
        // optionally handle errors
      }
    }

    // Optional: beat immediately on open
    sendBeat();

    const id = window.setInterval(sendBeat, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [open, problem?.problemId, problem?.status, problem?.lastStartedAt, note]);

  if (!open || !problem) return null;

  const displayedSeconds = getDisplayedSeconds(problem, nowMs);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Problem modal for ${problem.problem.title}`}
    >
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#3e3e3e] bg-[#282828] shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#3e3e3e] p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-xs font-bold tracking-wider uppercase">
                {problem.problem.difficulty}
              </span>
              <CheckCircle size={16} className="text-[#00af9b]" />
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
          </div>

          <div className="flex flex-col justify-end items-end text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#ffa116] text-black px-4 py-1.5 rounded-full font-mono text-sm font-bold shadow-lg shadow-[#ffa11633]">
                <Timer size={14} className="animate-pulse" />
                {formatMMSS(displayedSeconds)}
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Status:{" "}
              <span className="text-white font-semibold">{problem.status}</span>
            </div>
          </div>

          <textarea
            value={note}
            onChange={(e) => {
              const next = e.target.value;
              setNote(next);
              onNoteLocalChange(problem.problemId, next);
            }}
            className="text-sm rounded-xl border border-[#3e3e3e] bg-[#1f1f1f] p-4 text-gray-200 w-full h-40"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#3e3e3e] p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#3e3e3e] px-3 py-2 text-sm text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
