import type { ReactNode } from "react";
import { CircleCheck, CircleDashed, CircleSlash, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Status } from "@/prisma/generated/prisma/enums";
import {
  DIFFICULTY_TEXT_CLASS,
  type ProblemDifficulty,
} from "@/constants/difficulty";
import { STATUS_LABELS } from "@/constants/status";

export function DifficultyText({
  difficulty,
  className,
}: {
  difficulty: ProblemDifficulty;
  className?: string;
}) {
  return (
    <span className={cn("font-medium", DIFFICULTY_TEXT_CLASS[difficulty], className)}>
      {difficulty}
    </span>
  );
}

const STATUS_ICONS = {
  TODO: <CircleDashed className="size-3.5 text-muted-foreground" />,
  IN_PROGRESS: <Timer className="size-3.5 text-primary" />,
  TRIED: <CircleSlash className="size-3.5 text-muted-foreground" />,
  SOLVED: <CircleCheck className="size-3.5 text-foreground" />,
} satisfies Record<Status, ReactNode>;

/** icon + label; only "In progress" is colored so running problems stand out */
export function StatusLabel({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {STATUS_ICONS[status]}
      {STATUS_LABELS[status]}
    </span>
  );
}

/** pulsing dot shown next to a running timer */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-1.5 shrink-0 animate-pulse rounded-full bg-primary", className)}
    />
  );
}
