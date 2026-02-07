const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatDayMonthYear(
  value: string | Date | null | undefined,
  fallback = "-",
) {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}
