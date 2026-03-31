import Link from "next/link";
import { formatDuration } from "@/lib/date";
import { getSolveSessions } from "@/lib/solveSessions";

type Session = Awaited<ReturnType<typeof getSolveSessions>>[number];

export default function SolveSessions({
  sessions,
  timezone,
}: {
  sessions: Session[];
  timezone: string;
}) {
  const sessionsByDay = sessions.reduce<Record<string, Session[]>>(
    (acc, session) => {
      const day = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(session.startedAt));
      (acc[day] ??= []).push(session);
      return acc;
    },
    {},
  );

  return (
    <div>
      <div className="text-lg font-semibold mb-3">Recent Sessions</div>
      {sessions.length === 0 ? (
        <p className="text-gray-500 text-sm">No sessions yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(sessionsByDay).map(([day, daySessions]) => (
            <div key={day}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {day}
              </p>
              <div className="border border-[#3e3e3e] bg-[#282828] overflow-hidden">
                {/* Header */}
                <div className="flex items-center border-b border-[#3e3e3e] bg-[#232323] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="px-4 py-2 w-10 text-center shrink-0">#</span>
                  <span className="px-3 py-2 flex-1 border-l border-[#3e3e3e]">
                    Problem
                  </span>
                  <div className="flex shrink-0 divide-x divide-[#3e3e3e] border-l border-[#3e3e3e]">
                    <span className="px-3 py-2 w-24">Duration</span>
                    <span className="px-3 py-2 w-30">Start Time</span>
                  </div>
                </div>

                {daySessions.map((session, i) => {
                  const inProgress = !session.finishedAt;
                  const duration = formatDuration(session.duration);

                  return (
                    <div
                      key={i}
                      className={`flex items-center text-white font-mono ${
                        i % 2 === 0 ? "bg-[#282828]" : "bg-[#242424]"
                      } ${i !== daySessions.length - 1 ? "border-b border-[#3e3e3e]" : ""}`}
                    >
                      <span className="px-4 py-3 w-10 text-center text-xs font-mono shrink-0">
                        {daySessions.length - i}
                      </span>

                      <div className="flex items-center gap-2 px-3 py-3 flex-1 min-w-0 border-l border-[#3e3e3e]">
                        <Link
                          href={session.userProblem.problem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm truncate"
                        >
                          {session.userProblem.problem.title}
                        </Link>
                      </div>

                      <div className="flex self-stretch shrink-0 text-sm divide-x divide-[#3e3e3e] border-l border-[#3e3e3e]">
                        <span
                          className={`px-3 flex items-center font-mono w-24 justify-start${inProgress ? " text-yellow-500" : ""}`}
                        >
                          {duration}
                        </span>
                        <span className="px-3 flex items-center w-30">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone: timezone,
                          }).format(new Date(session.startedAt))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
