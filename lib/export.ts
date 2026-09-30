import type { UserProblemFullClient } from "@/types/client";

type CsvValue = string | number | null | undefined;

function escapeCsv(value: CsvValue) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows: CsvValue[][]) {
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

/** one row per tracked problem, including notes */
export function problemsToCsv(problems: UserProblemFullClient[]) {
  const header = [
    "number",
    "title",
    "difficulty",
    "status",
    "duration_seconds",
    "solved_at",
    "time_complexity",
    "space_complexity",
    "topics",
    "note",
    "link",
  ];

  const rows = problems.map((p) => [
    p.problem.questionId,
    p.problem.title,
    p.problem.difficulty,
    p.status,
    p.duration,
    p.solvedAt,
    p.timeComplexity,
    p.spaceComplexity,
    p.problem.tags.join("; "),
    p.note,
    p.problem.link,
  ]);

  return toCsv([header, ...rows]);
}
