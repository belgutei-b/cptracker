import { formatDuration } from "@/lib/date";
import { getSolveSessions } from "@/lib/solveSessions";

type Session = Awaited<ReturnType<typeof getSolveSessions>>[number];

const DIFFICULTY_COLORS = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
} as const;

export default function Analytics({ sessions }: { sessions: Session[] }) {
  const completedSessions = sessions.filter((s) => s.finishedAt);

  const avgSeconds =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => {
            return (
              sum +
              (new Date(s.finishedAt!).getTime() -
                new Date(s.startedAt).getTime()) /
                1000
            );
          }, 0) / completedSessions.length,
        )
      : null;

  const uniqueProblems = new Map<
    string,
    { difficulty: "Easy" | "Medium" | "Hard" }
  >();
  for (const s of sessions) {
    if (!uniqueProblems.has(s.userProblemId)) {
      uniqueProblems.set(s.userProblemId, {
        difficulty: s.userProblem.problem.difficulty,
      });
    }
  }

  const total = uniqueProblems.size;
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  for (const { difficulty } of uniqueProblems.values()) {
    byDifficulty[difficulty]++;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-[#3e3e3e] bg-[#282828] p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Avg Solve Time
        </p>
        <p className="text-2xl font-mono font-semibold">
          {avgSeconds !== null ? formatDuration(avgSeconds) : "—"}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {completedSessions.length} completed session
          {completedSessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border border-[#3e3e3e] bg-[#282828] p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Problems Practiced
        </p>
        <p className="text-2xl font-mono font-semibold">{total}</p>
        <div className="flex gap-3 mt-1">
          {(["Easy", "Medium", "Hard"] as const).map((d) => (
            <span key={d} className={`text-xs font-mono ${DIFFICULTY_COLORS[d]}`}>
              {byDifficulty[d]} {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
