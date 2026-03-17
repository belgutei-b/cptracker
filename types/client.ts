import type { Problem, UserProblem } from "@/prisma/generated/prisma/client";

type DateToString<T> = T extends Date
  ? string
  : T extends Date | null
    ? string | null
    : T extends (infer U)[]
      ? DateToString<U>[]
      : T extends object
        ? { [K in keyof T]: DateToString<T[K]> }
        : T;

export type UserProblemFullServer = UserProblem & { problem: Problem };

export type UserProblemFullClient = DateToString<UserProblemFullServer>;

export function serializeDates<T>(value: T): DateToString<T> {
  if (value instanceof Date) return value.toISOString() as DateToString<T>;
  if (Array.isArray(value)) return value.map(serializeDates) as DateToString<T>;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serializeDates(v);
    }
    return out as DateToString<T>;
  }
  return value as DateToString<T>;
}
