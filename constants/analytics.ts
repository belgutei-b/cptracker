export const ANALYTICS_RANGE_OPTIONS = [7, 14, 28] as const;

export type AnalyticsRangeDays = (typeof ANALYTICS_RANGE_OPTIONS)[number];

/** chart colors that aren't a difficulty (recharts needs raw values) */
export const CHART_COLORS = {
  grid: "#23292d",
  axis: "#8a9299",
  solvedLine: "#c6f36d",
  cursor: "rgba(255, 255, 255, 0.04)",
  track: "#161a1c",
} as const;

export const CHART_TICK_STYLE = {
  fill: CHART_COLORS.axis,
  fontSize: 12,
  fontFamily: "var(--font-geist-mono)",
};
