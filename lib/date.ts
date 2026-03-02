export function formatDayMonthYear(
  value: string | Date | null | undefined,
  timezone?: string,
  fallback = "-",
) {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  const normalizedTimezone = timezone?.trim() || "UTC";

  const formatInTimezone = (tz: string) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      day: "numeric",
      month: "short",
      year: "numeric",
    }).formatToParts(date);

    const day = parts.find((part) => part.type === "day")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const year = parts.find((part) => part.type === "year")?.value;

    if (!day || !month || !year) return null;
    return `${day} ${month}, ${year}`;
  };

  try {
    const formatted = formatInTimezone(normalizedTimezone);
    if (formatted) return formatted;
  } catch {
    // Fall back to UTC if caller timezone is invalid.
  }

  try {
    const formatted = formatInTimezone("UTC");
    if (formatted) return formatted;
  } catch {
    // Ignore and return fallback below.
  }

  return fallback;
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
