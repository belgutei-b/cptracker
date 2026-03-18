import { vi, describe, it, expect, beforeEach } from "vitest";
import { testUser, testProblem, prisma } from "@/tests/setup";
import { getCurrentUserId } from "@/lib/user";

import {
  startProblem,
  finishProblem,
  saveProblem,
} from "@/tests/api/problems/helpers";

vi.mock("@/lib/user", () => ({
  getCurrentUserId: vi.fn(),
  getUserTimezone: vi.fn().mockResolvedValue("UTC"),
}));

/**
 * Save notes flow
 * 1. 401 unauthenticated
 * 2. 400 nonexistent problem
 * 3. 400 invalid field type
 * 4. full flow: save at each status, verify values persist and status unchanged
 * 5. overwrite: save again with different values
 */
describe("PATCH /api/problems/:id/save", () => {
  const NOTES = {
    note: "my note",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  };

  beforeEach(async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser.id);
    await prisma.userProblem.create({
      data: { userId: testUser.id, problemId: testProblem.id },
    });
  });

  const start = () => startProblem(testProblem.id);
  const finish = (newStatus: string) => finishProblem(testProblem.id, newStatus);
  const save = (fields = NOTES) => saveProblem(testProblem.id, fields);

  const getRow = () =>
    prisma.userProblem.findFirst({
      where: { userId: testUser.id, problemId: testProblem.id },
      select: {
        status: true,
        note: true,
        timeComplexity: true,
        spaceComplexity: true,
      },
    });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(null);
    const res = await save();
    expect(res.status).toBe(401);
  });

  it("returns 400 for nonexistent problem", async () => {
    const res = await saveProblem("nonexistent-id");
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid field type", async () => {
    const res = await saveProblem(testProblem.id, {
      note: null as unknown as string,
      timeComplexity: "",
      spaceComplexity: "",
    });
    expect(res.status).toBe(400);
  });

  it("full save flow across all statuses, values persist and status unchanged", async () => {
    // TODO: save
    let res = await save();
    expect(res.status).toBe(200);
    let row = await getRow();
    expect(row?.note).toBe(NOTES.note);
    expect(row?.timeComplexity).toBe(NOTES.timeComplexity);
    expect(row?.spaceComplexity).toBe(NOTES.spaceComplexity);
    expect(row?.status).toBe("TODO");

    // IN_PROGRESS: save
    await start();
    res = await save();
    expect(res.status).toBe(200);
    row = await getRow();
    expect(row?.note).toBe(NOTES.note);
    expect(row?.status).toBe("IN_PROGRESS");

    // TRIED: save
    await finish("TRIED");
    res = await save();
    expect(res.status).toBe(200);
    row = await getRow();
    expect(row?.note).toBe(NOTES.note);
    expect(row?.status).toBe("TRIED");

    // SOLVED: save
    await start();
    await finish("SOLVED");
    res = await save();
    expect(res.status).toBe(200);
    row = await getRow();
    expect(row?.note).toBe(NOTES.note);
    expect(row?.status).toBe("SOLVED");
  });

  it("overwrite: second save replaces values", async () => {
    await save(NOTES);
    const updated = {
      note: "updated note",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(n)",
    };
    const res = await save(updated);
    expect(res.status).toBe(200);
    const row = await getRow();
    expect(row?.note).toBe(updated.note);
    expect(row?.timeComplexity).toBe(updated.timeComplexity);
    expect(row?.spaceComplexity).toBe(updated.spaceComplexity);
  });
});
