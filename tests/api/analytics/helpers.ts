import { GET as GET_BARCHART } from "@/app/api/analytics/bar-chart/route";
import { NextRequest } from "next/server";
import { expect } from "vitest";
import { BarChartData } from "@/types/stat";
import { prisma } from "@/tests/setup";

export async function getBarChart(
  numberOfDays: number = 7,
): Promise<BarChartData[]> {
  const url = new URL("http://localhost/api/analytics/bar-chart");
  url.searchParams.set("numberOfDays", String(numberOfDays));
  const res = await GET_BARCHART(new Request(url) as unknown as NextRequest);
  expect(res.status).toBe(200);
  const { data } = (await res.json()) as { data: BarChartData[] };
  return data;
}

export async function insertSolveSession(
  userProblemId: string,
  startedAt: Date,
  finishedAt: Date | null,
  duration: number | null,
) {
  return prisma.solveSession.create({
    data: {
      userProblemId,
      startedAt,
      finishedAt,
      duration: duration ?? 0,
    },
  });
}
