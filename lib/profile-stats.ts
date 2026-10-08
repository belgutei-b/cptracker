import { DateTime } from "luxon";
import type { getSolveSessions } from "@/lib/solveSessions";
import { getDisplayedSeconds } from "@/lib/timer";
import { DIFFICULTIES, type ProblemDifficulty } from "@/constants/difficulty";
import type { UserProblemFullClient } from "@/types/client";

/*
 * Profile numbers derived from data the app already loads
 * (the user's problems and solve sessions). All days are calendar days
 * in the user's time zone.
 */

export type SolveSessionWithProblem = Awaited<
  ReturnType<typeof getSolveSessions>
>[number];

const TOP_TOPICS_COUNT = 5;

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  return values.length > 0 ? sum(values) / values.length : 0;
}

// ---------- problems ----------

export type DifficultyStat = {
  difficulty: ProblemDifficulty;
  count: number;
  avgSeconds: number;
};

export type TopicStat = { topic: string; count: number };

export function getProblemStats(
  problems: UserProblemFullClient[],
  nowMs: number,
) {
  const solved = problems.filter((p) => p.status === "SOLVED");

  const byDifficulty: DifficultyStat[] = DIFFICULTIES.map((difficulty) => {
    const matching = solved.filter((p) => p.problem.difficulty === difficulty);
    return {
      difficulty,
      count: matching.length,
      avgSeconds: average(matching.map((p) => p.duration)),
    };
  });

  const topicCounts = new Map<string, number>();
  for (const problem of solved) {
    for (const topic of problem.problem.tags) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }
  const topTopics: TopicStat[] = [...topicCounts]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic))
    .slice(0, TOP_TOPICS_COUNT);

  return {
    solvedCount: solved.length,
    trackedCount: problems.length,
    // problem durations also cover time from before solve sessions existed
    practicedSeconds: sum(problems.map((p) => getDisplayedSeconds(p, nowMs))),
    avgSolveSeconds: average(solved.map((p) => p.duration)),
    byDifficulty,
    topTopics,
  };
}

export type ProblemStats = ReturnType<typeof getProblemStats>;

// ---------- daily activity ----------

type DayActivity = { seconds: number; solved: number };

/** seconds practiced and problems solved per day (yyyy-MM-dd), over the whole history */
export function getDailyActivity({
  sessions,
  problems,
  timezone,
  now,
}: {
  sessions: SolveSessionWithProblem[];
  problems: UserProblemFullClient[];
  timezone: string;
  now: Date;
}) {
  const days = new Map<string, DayActivity>();

  function dayOf(date: DateTime) {
    const key = date.toISODate()!;
    let day = days.get(key);
    if (!day) {
      day = { seconds: 0, solved: 0 };
      days.set(key, day);
    }
    return day;
  }

  for (const session of sessions) {
    const end = DateTime.fromJSDate(session.finishedAt ?? now, {
      zone: timezone,
    });
    let cursor = DateTime.fromJSDate(session.startedAt, { zone: timezone });

    // a session that crosses midnight counts towards both days
    while (cursor < end) {
      const nextMidnight = cursor.startOf("day").plus({ days: 1 });
      const segmentEnd = end < nextMidnight ? end : nextMidnight;
      dayOf(cursor).seconds += Math.floor(segmentEnd.diff(cursor).as("seconds"));
      cursor = segmentEnd;
    }
  }

  for (const problem of problems) {
    if (problem.status === "SOLVED" && problem.solvedAt) {
      dayOf(DateTime.fromISO(problem.solvedAt, { zone: timezone })).solved += 1;
    }
  }

  return days;
}

export type DailyActivity = ReturnType<typeof getDailyActivity>;

function isActiveDay(activity: DailyActivity, date: DateTime) {
  const day = activity.get(date.toISODate()!);
  return !!day && (day.seconds > 0 || day.solved > 0);
}

/** a day counts towards a streak when the user practiced or solved anything */
export function getStreaks(
  activity: DailyActivity,
  timezone: string,
  now: Date,
) {
  const today = DateTime.fromJSDate(now, { zone: timezone }).startOf("day");

  // today isn't over yet, so a streak that reached yesterday is still current
  let cursor = isActiveDay(activity, today) ? today : today.minus({ days: 1 });
  let current = 0;
  while (isActiveDay(activity, cursor)) {
    current += 1;
    cursor = cursor.minus({ days: 1 });
  }

  const activeDates = [...activity.keys()]
    .map((key) => DateTime.fromISO(key, { zone: timezone }))
    .filter((date) => isActiveDay(activity, date))
    .sort((a, b) => a.toMillis() - b.toMillis());

  let longest = 0;
  let run = 0;
  let previous: DateTime | null = null;
  for (const date of activeDates) {
    const continuesRun =
      previous !== null && previous.plus({ days: 1 }).hasSame(date, "day");
    run = continuesRun ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  return { current, longest };
}

// ---------- heatmap ----------

export type HeatmapDay = {
  date: string;
  label: string;
  seconds: number;
  solved: number;
  beforeJoin: boolean;
  future: boolean;
};

/** `weeks` full weeks (Monday first) ending with the current week */
export function getHeatmapDays({
  activity,
  timezone,
  now,
  joinedAt,
  weeks = 53,
}: {
  activity: DailyActivity;
  timezone: string;
  now: Date;
  joinedAt: Date;
  weeks?: number;
}): HeatmapDay[] {
  const today = DateTime.fromJSDate(now, { zone: timezone }).startOf("day");
  const joined = DateTime.fromJSDate(joinedAt, { zone: timezone }).startOf("day");
  const start = today.startOf("week").minus({ weeks: weeks - 1 });

  return Array.from({ length: weeks * 7 }, (_, i) => {
    const day = start.plus({ days: i });
    const date = day.toISODate()!;
    const dayActivity = activity.get(date);

    return {
      date,
      label: day.toFormat("ccc, d LLL yyyy"),
      seconds: dayActivity?.seconds ?? 0,
      solved: dayActivity?.solved ?? 0,
      beforeJoin: day < joined,
      future: day > today,
    };
  });
}

// ---------- sessions ----------

export type SessionRow = {
  key: string;
  startTime: string;
  startedAt: string;
  title: string;
  link: string;
  difficulty: ProblemDifficulty;
  seconds: number;
  running: boolean;
};

export type SessionDayGroup = {
  date: string;
  label: string;
  totalSeconds: number;
  sessions: SessionRow[];
};

function formatDayLabel(day: DateTime, today: DateTime) {
  const date = day.toFormat(
    day.year === today.year ? "ccc, d LLL" : "ccc, d LLL yyyy",
  );
  if (day.hasSame(today, "day")) return `Today · ${date}`;
  if (day.hasSame(today.minus({ days: 1 }), "day")) return `Yesterday · ${date}`;
  return date;
}

/** expects sessions newest first (as getSolveSessions returns them) */
export function groupSessionsByDay(
  sessions: SolveSessionWithProblem[],
  timezone: string,
  now: Date,
): SessionDayGroup[] {
  const today = DateTime.fromJSDate(now, { zone: timezone }).startOf("day");
  const groups: SessionDayGroup[] = [];

  for (const session of sessions) {
    const start = DateTime.fromJSDate(session.startedAt, { zone: timezone });
    const date = start.toISODate()!;

    let group = groups.at(-1);
    if (!group || group.date !== date) {
      group = { date, label: formatDayLabel(start, today), totalSeconds: 0, sessions: [] };
      groups.push(group);
    }

    const running = session.finishedAt === null;
    const seconds = running
      ? Math.max(0, Math.floor((now.getTime() - session.startedAt.getTime()) / 1000))
      : session.duration;
    const { problem } = session.userProblem;

    group.totalSeconds += seconds;
    group.sessions.push({
      key: `${session.userProblemId}-${session.startedAt.getTime()}`,
      startTime: start.toFormat("HH:mm"),
      startedAt: session.startedAt.toISOString(),
      title: problem.title,
      link: problem.link,
      difficulty: problem.difficulty as ProblemDifficulty,
      seconds,
      running,
    });
  }

  return groups;
}
