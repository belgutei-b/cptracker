import { getCurrentUserId } from "@/lib/user";
import { GET as GET_SOLVESESSIONS } from "@/app/api/solve-sessions/route";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  testUser0,
  testUser1,
  testProblem0,
  testProblem1,
  prisma,
} from "@/tests/setup";
import { finishProblem, startProblem } from "@/tests/api/problems/helpers";
import { getSolveSessionsAPI } from "@/tests/api/solve-sessions/helpers";
import {
  deserializeSolveSession,
  type SolveSessionClient,
} from "@/types/client";

async function getSolveSessions() {
  const res = await getSolveSessionsAPI();
  // converting date strings to date objects
  const body = ((await res.json()) as SolveSessionClient[]).map(
    deserializeSolveSession,
  );

  return { res, body };
}

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
  getUserTimezone: vi.fn().mockResolvedValue("UTC"),
}));

describe("Basic /solve-sessions", () => {
  let user0Problem0Id: string;
  let user0Problem1Id: string;
  let user1Problem0Id: string;

  // adding problems to 2 users
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

    const res = await GET_SOLVESESSIONS(
      new Request(
        "http://localhost/api/solve-sessions",
      ) as unknown as NextRequest,
    );
    expect(res.status).toBe(401);
  });

  it("1 finished session on 1 problem", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(user0Problem0Id);
    await finishProblem(user0Problem0Id, "TRIED");

    const { res, body } = await getSolveSessions();
    expect(res.status).toBe(200);
    expect(body.length).toBe(1);

    const startedAt = body[0].startedAt.getTime();
    const finishedAt = body[0].finishedAt!.getTime();

    expect(Number.isFinite(startedAt)).toBe(true);
    expect(Number.isFinite(finishedAt)).toBe(true);
    expect(finishedAt).toBeGreaterThan(startedAt);
    expect(body[0].duration).toBeGreaterThanOrEqual(0);
    expect(body[0].userProblemId).toBe(user0Problem0Id);
  });

  it("1 unfinished session on 1 problem", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(user0Problem0Id);

    const { res, body } = await getSolveSessions();
    expect(res.status).toBe(200);
    expect(body.length).toBe(1);

    const startedAt = body[0].startedAt.getTime();
    expect(Number.isFinite(startedAt)).toBe(true);
    expect(body[0].finishedAt).toBeNull();
    expect(body[0].duration).toBe(0);
    expect(body[0].userProblemId).toBe(user0Problem0Id);
  });

  it("1 finished and 1 unfinished on 1 problem", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(user0Problem0Id);
    await finishProblem(user0Problem0Id, "TRIED");
    await startProblem(user0Problem0Id);

    const { res, body } = await getSolveSessions();
    expect(res.status).toBe(200);
    expect(body.length).toBe(2);

    // latest session first: unfinished
    expect(body[0].finishedAt).toBeNull();
    expect(body[0].duration).toBe(0);
    expect(body[0].userProblemId).toBe(user0Problem0Id);

    // older session: finished
    expect(Number.isFinite(body[1].finishedAt!.getTime())).toBe(true);
    expect(body[1].duration).toBeGreaterThanOrEqual(0);
    expect(body[1].userProblemId).toBe(user0Problem0Id);

    // order check: body[0] started after body[1]
    expect(body[0].startedAt.getTime()).toBeGreaterThanOrEqual(
      body[1].startedAt.getTime(),
    );
  });

  it("2 problems on one user", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(user0Problem0Id);
    await startProblem(user0Problem1Id);
    await finishProblem(user0Problem1Id, "SOLVED");
    await finishProblem(user0Problem0Id, "TRIED");

    const { res, body } = await getSolveSessions();
    expect(res.status).toBe(200);
    expect(body.length).toBe(2);
    expect(body.every((s) => s.finishedAt !== null)).toBe(true);
    expect(body.map((s) => s.userProblemId).sort()).toEqual(
      [user0Problem0Id, user0Problem1Id].sort(),
    );

    // order check: body[0] started after body[1]
    expect(body[0].startedAt.getTime()).toBeGreaterThanOrEqual(
      body[1].startedAt.getTime(),
    );
  });

  it("2 users | each user with 1 session", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(user0Problem0Id);
    await finishProblem(user0Problem0Id, "TRIED");

    vi.mocked(getCurrentUserId).mockResolvedValue(testUser1.id);
    await startProblem(user1Problem0Id);
    await finishProblem(user1Problem0Id, "SOLVED");

    // user0 should only see their own session
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    const { res: resUser0, body: bodyUser0 } = await getSolveSessions();
    expect(resUser0.status).toBe(200);
    expect(bodyUser0.length).toBe(1);
    expect(bodyUser0[0].userProblemId).toBe(user0Problem0Id);

    // user1 should only see their own session
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser1.id);
    const { res: resUser1, body: bodyUser1 } = await getSolveSessions();
    expect(resUser1.status).toBe(200);
    expect(bodyUser1.length).toBe(1);
    expect(bodyUser1[0].userProblemId).toBe(user1Problem0Id);
  });
});
