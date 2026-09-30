import type { ReactNode } from "react";
import Link from "next/link";
import { CircleCheck, Clock, Flame, Timer } from "lucide-react";

import ActivityHeatmap from "@/components/profile/ActivityHeatmap";
import ProfileCard from "@/components/profile/ProfileCard";
import SessionList from "@/components/profile/SessionList";
import { cn, pluralize } from "@/lib/utils";
import { formatDuration } from "@/lib/date";
import { DIFFICULTY_DOT_CLASS } from "@/constants/difficulty";
import type {
  DifficultyStat,
  HeatmapDay,
  ProblemStats,
  SessionDayGroup,
  TopicStat,
} from "@/lib/profile-stats";

export default function ProfileOverview({
  stats,
  sessionCount,
  streaks,
  heatmapDays,
  recentSessions,
}: {
  stats: ProblemStats;
  sessionCount: number;
  streaks: { current: number; longest: number };
  heatmapDays: HeatmapDay[];
  recentSessions: SessionDayGroup[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          icon={<CircleCheck />}
          label="Solved"
          value={stats.solvedCount}
          detail={`of ${pluralize(stats.trackedCount, "problem")} tracked`}
        />
        <StatCard
          icon={<Clock />}
          label="Time practiced"
          value={stats.practicedSeconds > 0 ? formatDuration(stats.practicedSeconds) : "—"}
          detail={`across ${pluralize(sessionCount, "solve session")}`}
        />
        <StatCard
          icon={<Flame />}
          label="Current streak"
          value={pluralize(streaks.current, "day")}
          detail={`Longest: ${pluralize(streaks.longest, "day")}`}
          highlight={streaks.current > 0}
        />
        <StatCard
          icon={<Timer />}
          label="Average solve time"
          value={stats.solvedCount > 0 ? formatDuration(Math.round(stats.avgSolveSeconds)) : "—"}
          detail={`over ${pluralize(stats.solvedCount, "solved problem")}`}
        />
      </div>

      <ActivityHeatmap days={heatmapDays} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <ProfileCard
          title="Recent sessions"
          action={
            <Link
              href="/profile?tab=sessions"
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          }
        >
          {recentSessions.length > 0 ? (
            <SessionList groups={recentSessions} />
          ) : (
            <p className="border-t px-5 py-10 text-center text-sm text-muted-foreground">
              No solve sessions yet. Start a problem from the dashboard.
            </p>
          )}
        </ProfileCard>

        <div className="flex flex-col gap-5">
          <DifficultyBreakdown
            byDifficulty={stats.byDifficulty}
            solvedCount={stats.solvedCount}
          />
          <TopTopics topics={stats.topTopics} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border bg-card px-4 py-4 md:px-5">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground [&_svg]:size-3.5">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "font-mono text-2xl leading-none font-medium tracking-tight md:text-[28px]",
          highlight && "text-primary",
        )}
      >
        {value}
      </div>
      <div className="text-[13px] text-muted-foreground">{detail}</div>
    </div>
  );
}

function DifficultyBreakdown({
  byDifficulty,
  solvedCount,
}: {
  byDifficulty: DifficultyStat[];
  solvedCount: number;
}) {
  return (
    <ProfileCard
      title="Solved by difficulty"
      action={
        <span className="font-mono text-[13px] text-muted-foreground">
          {solvedCount} total
        </span>
      }
    >
      <div className="flex flex-col gap-4 px-5 pb-5">
        {/* proportion bar; an empty track until something is solved */}
        <div aria-hidden className="flex h-2.5 gap-[3px] overflow-hidden rounded-full bg-muted">
          {byDifficulty.map(
            ({ difficulty, count }) =>
              count > 0 && (
                <span
                  key={difficulty}
                  className={DIFFICULTY_DOT_CLASS[difficulty]}
                  style={{ flexGrow: count }}
                />
              ),
          )}
        </div>

        <dl className="flex flex-col gap-2.5 text-sm">
          {byDifficulty.map(({ difficulty, count, avgSeconds }) => (
            <div key={difficulty} className="grid grid-cols-[minmax(0,1fr)_40px_96px] items-center">
              <dt className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", DIFFICULTY_DOT_CLASS[difficulty])} />
                {difficulty}
              </dt>
              <dd className="text-right font-mono">{count}</dd>
              <dd className="text-right font-mono text-[13px] text-muted-foreground">
                {count > 0 ? `avg ${formatDuration(Math.round(avgSeconds))}` : "—"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </ProfileCard>
  );
}

function TopTopics({ topics }: { topics: TopicStat[] }) {
  const maxCount = topics[0]?.count ?? 0;

  return (
    <ProfileCard
      title="Top topics"
      action={<span className="text-[13px] text-muted-foreground">by problems solved</span>}
    >
      {topics.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-muted-foreground">
          Topics show up here once you solve problems.
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5 px-5 pb-5">
          {topics.map(({ topic, count }) => (
            <li key={topic} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span>{topic}</span>
                <span className="font-mono text-foreground/75">{count}</span>
              </div>
              <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ProfileCard>
  );
}
