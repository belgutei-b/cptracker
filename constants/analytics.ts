export const ANALYTICS_RANGE_OPTIONS = [7, 14, 28] as const;

export type AnalyticsRangeDays = (typeof ANALYTICS_RANGE_OPTIONS)[number];
