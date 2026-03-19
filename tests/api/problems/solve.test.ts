import { vi, describe, it, expect, beforeEach } from "vitest";
import { testUser0, testProblem0, prisma } from "@/tests/setup";
import { getCurrentUserId } from "@/lib/user";
import {
  startProblem,
  finishProblem,
  getProblemStatus,
} from "@/tests/api/problems/helpers";

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
  getUserTimezone: vi.fn().mockResolvedValue("UTC"),
}));

/**
 * Problem solving flow
 * 1. start posted problem → IN_PROGRESS
 * 2. finish with invalid status → 422, stays IN_PROGRESS
 * 3. finish to TRIED → restart → IN_PROGRESS
 * 4. finish to SOLVED → restart → 404
 */
describe("Problem solving flow", () => {
  beforeEach(async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await prisma.userProblem.create({
      data: { userId: testUser0.id, problemId: testProblem0.id },
    });
  });

  const start = () => startProblem(testProblem0.id);
  const finish = (newStatus: string) =>
    finishProblem(testProblem0.id, newStatus);
  const getStatus = () => getProblemStatus(testUser0.id, testProblem0.id);

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
