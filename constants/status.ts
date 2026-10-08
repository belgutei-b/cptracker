import type { Status } from "@/prisma/generated/prisma/enums";

export const STATUSES: Status[] = ["TODO", "IN_PROGRESS", "TRIED", "SOLVED"];

export const STATUS_LABELS: Record<Status, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  TRIED: "Tried",
  SOLVED: "Solved",
};

/** label of the row button that opens the problem */
export const STATUS_ACTIONS: Record<Status, string> = {
  TODO: "Start",
  IN_PROGRESS: "Resume",
  TRIED: "Retry",
  SOLVED: "Open",
};

/** opening a problem in one of these statuses starts a new solve session */
export const STARTABLE_STATUSES: Status[] = ["TODO", "TRIED"];
