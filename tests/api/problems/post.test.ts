// tests/api/problems/post.test.ts
import { vi, describe, it, expect, beforeEach } from "vitest";
import { testUser, prisma } from "@/tests/setup";

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
  getUserTimezone: vi.fn().mockResolvedValue("UTC"),
}));

import { getCurrentUserId } from "@/lib/user";
import {
  POST as POST_PROBLEM,
  GET as GET_PROBLEMS,
} from "@/app/api/problems/route";
import { POST as POST_DAILY_PROBLEM } from "@/app/api/problems/daily/route";
import {
  startProblem,
  finishProblem,
  getProblemStatus,
} from "@/tests/api/problems/helpers";

/**
 * Adding problem
 * 1. unauth user
 * 2. missing problemLink
 * 3. add valid problem
 * 4. adding same problem twice
 */
describe("POST /api/problems", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        problemLink: "https://leetcode.com/problems/two-sum/",
      }),
    });

    const res = await POST_PROBLEM(req as any);
    expect(res.status).toBe(401);
  });

  it("returns 400 when problemLink is missing", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST_PROBLEM(req as any);
    expect(res.status).toBe(400);
  });

  it("returns 200 and persists the problem on happy path", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        problemLink: "https://leetcode.com/problems/two-sum/",
      }),
    });

    const res = await POST_PROBLEM(req as any);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.problem).toBeDefined();
    expect(body.problem.problem.titleSlug).toBe("two-sum");
    expect(body.problem.userId).toBe(testUser.id);

    const row = await prisma.userProblem.findFirst({
      where: { userId: testUser.id },
      include: { problem: true },
    });
    expect(row).not.toBeNull();
    expect(row!.problem.titleSlug).toBe("two-sum");
  });

  it("returns 409 when adding the same problem twice", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const req = () =>
      new Request("http://localhost/api/problems", {
        method: "POST",
        body: JSON.stringify({
          problemLink: "https://leetcode.com/problems/two-sum/",
        }),
      });

    await POST_PROBLEM(req() as any);
    const res = await POST_PROBLEM(req() as any);
    expect(res.status).toBe(409);
  });
});

/**
 * Daily problem
 * 1. unauth user
 * 2. adds daily problem (should return problem, alreadyAdded is false)
 * 3. adds daily problem again (should return problem, alreadyAdded is true)
 */
describe("POST /api/problems/daily", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);

    const res = await POST_DAILY_PROBLEM();
    expect(res.status).toBe(401);
  });

  it("returns 200 with problem on first add, count increases by 1", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    const beforeBody = await (await GET_PROBLEMS()).json();
    const countBefore = beforeBody.problems.length;

    const res = await POST_DAILY_PROBLEM();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.alreadyAdded).toBe(false);
    expect(body.problemId).toBeDefined();
    expect(body.problem).not.toBeNull();
    expect(body.problem.userId).toBe(testUser.id);
    expect(body.problem.status).toBe("IN_PROGRESS");

    const afterBody = await (await GET_PROBLEMS()).json();
    expect(afterBody.problems.length).toBe(countBefore + 1);
  });

  it("returns alreadyAdded true on second add, count does not increase", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);

    await POST_DAILY_PROBLEM();

    const beforeBody = await (await GET_PROBLEMS()).json();
    const countBefore = beforeBody.problems.length;

    const res = await POST_DAILY_PROBLEM();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.alreadyAdded).toBe(true);
    expect(body.problemId).toBeDefined();
    expect(body.problem).toBeNull();

    const afterBody = await (await GET_PROBLEMS()).json();
    expect(afterBody.problems.length).toBe(countBefore);
  });
});

/**
 * Problem solving flow
 * 1. start posted problem → IN_PROGRESS
 * 2. finish with invalid status → 422, stays IN_PROGRESS
 * 3. finish to TRIED → restart → IN_PROGRESS
 * 4. finish to SOLVED → restart → 404
 */
describe("Problem solving flow", () => {
  let problemId: string;

  beforeEach(async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);
    const req = new Request("http://localhost/api/problems", {
      method: "POST",
      body: JSON.stringify({
        problemLink: "https://leetcode.com/problems/two-sum/",
      }),
    });
    const res = await POST_PROBLEM(req as any);
    const body = await res.json();
    problemId = body.problem.problemId;
  });

  const start = () => startProblem(problemId);
  const finish = (newStatus: string) => finishProblem(problemId, newStatus);
  const getStatus = () => getProblemStatus(problemId);

  it("finish with invalid status returns 422, status stays IN_PROGRESS", async () => {
    const res = await start();
    expect(res.status).toBe(200);
    expect(await getStatus()).toBe("IN_PROGRESS");

    const res1 = await finish("NOT-SOLVED");
    expect(res1.status).toBe(422);
    expect(await getStatus()).toBe("IN_PROGRESS");
  });

  it("TODO->IN_PROGRESS->TRIED->IN_PROGRESS->SOLVED", async () => {
    // TODO -> IN_PROGRESS
    let res = await start();
    expect(res.status).toBe(200);
    expect(await getStatus()).toBe("IN_PROGRESS");

    // IN_PROGRESS -> TRIED
    await finish("TRIED");
    expect(await getStatus()).toBe("TRIED");

    // TRIED -> IN_PROGRESS
    res = await start();
    expect(res.status).toBe(200);
    expect(await getStatus()).toBe("IN_PROGRESS");

    // IN_PROGRESS -> SOLVED
    await finish("SOLVED");
    expect(await getStatus()).toBe("SOLVED");

    // restarting SOLVED problem
    res = await start();
    expect(res.status).toBe(404);
  });
});
