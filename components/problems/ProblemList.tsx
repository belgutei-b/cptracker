"use client";

import { ExternalLink, Lock, PanelRightOpen, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DifficultyText,
  LiveDot,
  StatusLabel,
} from "@/components/problems/ProblemLabels";
import { cn } from "@/lib/utils";
import { formatDayMonthYear, formatDuration } from "@/lib/date";
import { getDisplayedSeconds, isTimerRunning } from "@/lib/timer";
import type { ProblemDifficulty } from "@/constants/difficulty";
import { STATUS_ACTIONS, STATUS_LABELS } from "@/constants/status";
import type { UserProblemFullClient } from "@/types/client";

// keeps the topics cell to roughly one line
const MAX_TAGS = 2;
const TAG_CHAR_BUDGET = 26;

function getLastActivityDate(problem: UserProblemFullClient) {
  if (problem.status === "SOLVED") {
    return problem.solvedAt ?? problem.updatedAt ?? problem.createdAt;
  }

  if (problem.status === "IN_PROGRESS" || problem.status === "TRIED") {
    return problem.lastStartedAt ?? problem.updatedAt ?? problem.createdAt;
  }

  return problem.createdAt;
}

function fitTags(tags: string[]) {
  const shown: string[] = [];
  let usedChars = 0;

  for (const tag of tags) {
    const overBudget = usedChars + tag.length > TAG_CHAR_BUDGET;
    if (shown.length === MAX_TAGS || (shown.length > 0 && overBudget)) break;
    shown.push(tag);
    usedChars += tag.length;
  }

  return { shown, hiddenCount: tags.length - shown.length };
}

export default function ProblemList({
  problems,
  timezone,
  nowMs,
  startingProblemId,
  onOpenProblem,
}: {
  problems: UserProblemFullClient[];
  timezone: string;
  nowMs: number;
  startingProblemId: string | null;
  onOpenProblem: (problem: UserProblemFullClient) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="hidden w-16 px-4 text-muted-foreground sm:table-cell">
              #
            </TableHead>
            <TableHead className="px-4 text-muted-foreground">Problem</TableHead>
            <TableHead className="hidden w-24 px-4 text-muted-foreground md:table-cell">
              Difficulty
            </TableHead>
            <TableHead className="hidden w-32 px-4 text-muted-foreground md:table-cell">
              Status
            </TableHead>
            <TableHead className="hidden w-64 px-4 text-muted-foreground xl:table-cell">
              Topics
            </TableHead>
            <TableHead className="w-24 px-4 text-right text-muted-foreground">
              Time
            </TableHead>
            <TableHead className="hidden w-32 px-4 text-muted-foreground lg:table-cell">
              Last activity
            </TableHead>
            <TableHead className="w-14 sm:w-28">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {problems.map((problem) => (
            <ProblemRow
              key={problem.id}
              problem={problem}
              timezone={timezone}
              nowMs={nowMs}
              isStarting={startingProblemId === problem.id}
              onOpen={() => onOpenProblem(problem)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProblemRow({
  problem,
  timezone,
  nowMs,
  isStarting,
  onOpen,
}: {
  problem: UserProblemFullClient;
  timezone: string;
  nowMs: number;
  isStarting: boolean;
  onOpen: () => void;
}) {
  const { title, questionId, link } = problem.problem;
  const difficulty = problem.problem.difficulty as ProblemDifficulty;
  const running = isTimerRunning(problem);
  const seconds = getDisplayedSeconds(problem, nowMs);

  return (
    <TableRow>
      <TableCell className="hidden px-4 py-3 font-mono text-[13px] text-muted-foreground sm:table-cell">
        {questionId}
      </TableCell>

      <TableCell className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">{title}</span>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title} on LeetCode`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
        {/* columns hidden on small screens are summarised under the title */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground md:hidden">
          <span className="font-mono">#{questionId}</span>
          <span aria-hidden>·</span>
          <DifficultyText difficulty={difficulty} />
          <span aria-hidden>·</span>
          <span className={cn(running && "text-primary")}>
            {STATUS_LABELS[problem.status]}
          </span>
        </div>
      </TableCell>

      <TableCell className="hidden px-4 py-3 text-[13px] md:table-cell">
        <DifficultyText difficulty={difficulty} />
      </TableCell>

      <TableCell className="hidden px-4 py-3 text-[13px] md:table-cell">
        <StatusLabel status={problem.status} />
      </TableCell>

      <TableCell className="hidden px-4 py-3 xl:table-cell">
        <ProblemTopics problem={problem} />
      </TableCell>

      <TableCell className="px-4 py-3 text-right font-mono text-[13px]">
        {running ? (
          <span className="inline-flex items-center gap-2 text-primary">
            <LiveDot />
            {formatDuration(seconds)}
          </span>
        ) : (
          <span className="text-foreground/75">
            {seconds > 0 ? formatDuration(seconds) : "—"}
          </span>
        )}
      </TableCell>

      <TableCell className="hidden px-4 py-3 text-[13px] text-muted-foreground lg:table-cell">
        {formatDayMonthYear(getLastActivityDate(problem), timezone)}
      </TableCell>

      <TableCell className="py-3 pr-3 pl-0 text-right sm:px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpen}
          disabled={isStarting}
          aria-label={`${STATUS_ACTIONS[problem.status]} ${title}`}
          className={cn(
            running &&
              "border-primary/45 text-primary hover:bg-primary/10 hover:text-primary dark:border-primary/45",
          )}
        >
          {problem.status === "SOLVED" ? (
            <PanelRightOpen />
          ) : (
            <Play className="size-3 fill-current" />
          )}
          {/* icon-only on phones */}
          <span className="sr-only sm:not-sr-only">
            {STATUS_ACTIONS[problem.status]}
          </span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

/** topics stay hidden until the problem is solved so they don't give hints */
function ProblemTopics({ problem }: { problem: UserProblemFullClient }) {
  if (problem.status !== "SOLVED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Hidden until solved
      </span>
    );
  }

  const { shown, hiddenCount } = fitTags(problem.problem.tags);

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {shown.map((tag) => (
        <span
          key={tag}
          className="rounded-md border bg-muted px-2 py-0.5 text-xs whitespace-nowrap text-foreground/80"
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="font-mono text-xs text-muted-foreground">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
