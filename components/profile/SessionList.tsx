import { DifficultyText } from "@/components/problems/ProblemLabels";
import ElapsedTime from "@/components/profile/ElapsedTime";
import { formatDuration } from "@/lib/date";
import type { SessionDayGroup } from "@/lib/profile-stats";

/** solve sessions grouped by day, newest first */
export default function SessionList({ groups }: { groups: SessionDayGroup[] }) {
  return (
    <div>
      {groups.map((group) => (
        <section key={group.date} aria-label={group.label}>
          <div className="flex justify-between border-t bg-muted/40 px-5 py-2 text-[12.5px] font-medium text-muted-foreground">
            <span>{group.label}</span>
            <span className="font-mono">{formatDuration(group.totalSeconds)}</span>
          </div>

          <ul>
            {group.sessions.map((session) => (
              <li
                key={session.key}
                className="grid h-12 grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3.5 border-t px-5 transition-colors hover:bg-muted/30 sm:grid-cols-[52px_minmax(0,1fr)_76px_96px]"
              >
                <span className="font-mono text-[13px] text-muted-foreground">
                  {session.startTime}
                </span>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium hover:underline hover:underline-offset-4"
                >
                  {session.title}
                </a>
                <DifficultyText
                  difficulty={session.difficulty}
                  className="hidden text-[13px] sm:block"
                />
                <span className="text-right font-mono text-[13px] text-foreground/75">
                  {session.running ? (
                    <ElapsedTime startedAt={session.startedAt} />
                  ) : (
                    formatDuration(session.seconds)
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
