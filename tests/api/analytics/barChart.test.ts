import { getCurrentUserId } from "@/lib/user";
import { GET as GET_BARCHART } from "@/app/api/analytics/bar-chart/route";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  testUser0,
  testUser1,
  testProblem0,
  testProblem1,
  prisma,
} from "@/tests/setup";
import { insertSolveSession, getBarChart } from "@/tests/api/analytics/helpers";

function dateAt(daysAgo: number, hour: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d;
}

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
  getUserTimezone: vi.fn().mockResolvedValue("UTC"),
}));

describe("Basic /analytics/bar-chart", () => {
  let user0Problem0Id: string;
  let user0Problem1Id: string;
  let user1Problem0Id: string;

  beforeEach(async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    const up0 = await prisma.userProblem.create({
      data: { userId: testUser0.id, problemId: testProblem0.id },
    });
    const up1 = await prisma.userProblem.create({
      data: { userId: testUser0.id, problemId: testProblem1.id },
    });
    const up2 = await prisma.userProblem.create({
      data: { userId: testUser1.id, problemId: testProblem0.id },
    });
    user0Problem0Id = up0.id;
    user0Problem1Id = up1.id;
    user1Problem0Id = up2.id;
  });

  it("returns 401 when unathenticated", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);

    const res = await GET_BARCHART(
      new Request(
        "http://localhost/api/analytics/bar-chart",
      ) as unknown as NextRequest,
    );
    expect(res.status).toBe(401);
  });

  it("1 finished solveSession", async () => {
    await insertSolveSession(user0Problem0Id, dateAt(2, 1), dateAt(2, 2), 3600);

    const rows = await getBarChart();

    expect(rows).toHaveLength(7);

    for (let i = 0; i < 7; i++) {
      if (i === 4) continue;
      const row = rows[i];
      expect(row).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }

    // problem is not solved, only session is added
    expect(rows[4]).toMatchObject({
      easy: 3600,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
  });

  it("2 finished solveSession on same day", async () => {
    await insertSolveSession(user0Problem0Id, dateAt(2, 1), dateAt(2, 2), 3600);
    await insertSolveSession(user0Problem0Id, dateAt(2, 3), dateAt(2, 4), 3600);

    const rows = await getBarChart();

    expect(rows).toHaveLength(7);

    for (let i = 0; i < 7; i++) {
      if (i === 4) continue;
      const row = rows[i];
      expect(row).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }

    // durations of both sessions sum into the same day's easy bucket
    expect(rows[4]).toMatchObject({
      easy: 7200,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
  });

  it("2 finished solveSession on different days", async () => {
    await insertSolveSession(user0Problem0Id, dateAt(2, 1), dateAt(2, 2), 3600);
    await insertSolveSession(user0Problem0Id, dateAt(1, 1), dateAt(1, 2), 3600);

    const rows = await getBarChart();

    expect(rows).toHaveLength(7);

    for (let i = 0; i < 7; i++) {
      if (i === 4 || i === 5) continue;
      expect(rows[i]).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }

    // each session lands in its own day bucket
    expect(rows[4]).toMatchObject({
      easy: 3600,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
    expect(rows[5]).toMatchObject({
      easy: 3600,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
  });

  it("unfinished solveSession started today", async () => {
    // today's contribution: midnight → now (non-deterministic, assert > 0)
    await insertSolveSession(user0Problem0Id, dateAt(0, 0), null, null);

    const rows = await getBarChart();

    expect(rows).toHaveLength(7);

    for (let i = 0; i < 7; i++) {
      if (i === 6) continue;
      expect(rows[i]).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }

    expect(rows[6].easy).toBeGreaterThan(0);
  });

  it("unfinished solveSession started yesterday", async () => {
    // session started yesterday at 20:00, still running
    // yesterday's contribution: 20:00 → midnight = 4h = 14400s (deterministic)
    // today's contribution: midnight → now (non-deterministic, assert > 0)
    await insertSolveSession(user0Problem0Id, dateAt(1, 20), null, null);

    const rows = await getBarChart();

    expect(rows).toHaveLength(7);

    for (let i = 0; i < 7; i++) {
      if (i === 5 || i === 6) continue;
      expect(rows[i]).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }

    expect(rows[5]).toMatchObject({
      easy: 14400,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
    expect(rows[6].easy).toBeGreaterThan(0);
  });

  it("solveSessions on 2 problems on 2 users", async () => {
    // user0: easy problem (problem0) + hard problem (problem1), both 2 days ago
    await insertSolveSession(user0Problem0Id, dateAt(2, 1), dateAt(2, 3), 7200);
    await insertSolveSession(user0Problem1Id, dateAt(2, 4), dateAt(2, 6), 7200);
    // user1: easy problem (problem0), 2 days ago
    await insertSolveSession(
      user1Problem0Id,
      dateAt(2, 2),
      dateAt(2, 5),
      10800,
    );

    // user0's bar chart: easy + hard from their own sessions only
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    const user0Rows = await getBarChart();

    for (let i = 0; i < 7; i++) {
      if (i === 4) continue;
      expect(user0Rows[i]).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }
    expect(user0Rows[4]).toMatchObject({
      easy: 7200,
      medium: 0,
      hard: 7200,
      problemCount: 0,
    });

    // user1's bar chart: only their easy session, unaffected by user0
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser1.id);
    const user1Rows = await getBarChart();

    for (let i = 0; i < 7; i++) {
      if (i === 4) continue;
      expect(user1Rows[i]).toMatchObject({
        easy: 0,
        medium: 0,
        hard: 0,
        problemCount: 0,
      });
    }
    expect(user1Rows[4]).toMatchObject({
      easy: 10800,
      medium: 0,
      hard: 0,
      problemCount: 0,
    });
  });
});
