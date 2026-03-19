import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  testUser0,
  testUser1,
  testProblem0,
  testProblem1,
  prisma,
} from "@/tests/setup";
import { getCurrentUserId } from "@/lib/user";
import {
  getProblemStatus,
  getSolveSessions,
  startProblem,
  finishProblem,
  saveProblem,
} from "@/tests/api/problems/helpers";

describe("SolveSession flow", () => {
  beforeEach(async () => {
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await prisma.userProblem.create({
      data: { userId: testUser0.id, problemId: testProblem0.id },
    });
    await prisma.userProblem.create({
      data: { userId: testUser0.id, problemId: testProblem1.id },
    });
    await prisma.userProblem.create({
      data: { userId: testUser1.id, problemId: testProblem0.id },
    });
  });

  it("TODO->IN_PROGRESS->TRIED->IN_PROGRESS->SOLVED", async () => {
    // initial state: no sessions, status TODO
    let sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(0);
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("TODO");

    // TODO -> IN_PROGRESS: 1 open session
    await startProblem(testProblem0.id);
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(1);
    expect(sessions[0].finishedAt).toBeNull();
    expect(sessions[0].startedAt).toBeInstanceOf(Date);
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("IN_PROGRESS");

    // IN_PROGRESS -> TRIED: session is now finished
    await finishProblem(testProblem0.id, "TRIED");
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(1);
    expect(sessions[0].finishedAt).toBeInstanceOf(Date);
    expect(sessions[0].duration).toBeGreaterThanOrEqual(0);
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("TRIED");

    // update note: no new session created
    await saveProblem(testProblem0.id, "some note");
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(1);

    // TRIED -> IN_PROGRESS: new open session, old one stays finished
    await startProblem(testProblem0.id);
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(2);
    expect(sessions.filter((s) => s.finishedAt !== null).length).toBe(1);
    expect(sessions.filter((s) => s.finishedAt === null).length).toBe(1);
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("IN_PROGRESS");

    // IN_PROGRESS -> SOLVED: both sessions finished
    await finishProblem(testProblem0.id, "SOLVED");
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(2);
    expect(sessions.every((s) => s.finishedAt !== null)).toBe(true);
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("SOLVED");

    // total duration on UserProblem equals sum of session durations
    const totalSessionDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const userProblem = await prisma.userProblem.findFirst({
      where: { userId: testUser0.id, problemId: testProblem0.id },
      select: { duration: true },
    });
    expect(userProblem?.duration).toBe(totalSessionDuration);

    // update note: sessions are untouched
    const sessionsBeforeNoteUpdate = sessions;
    await saveProblem(testProblem0.id, "updated note");
    sessions = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(sessions.length).toBe(2);
    expect(sessions.map((s) => s.id)).toEqual(sessionsBeforeNoteUpdate.map((s) => s.id));
    expect(sessions.map((s) => s.duration)).toEqual(sessionsBeforeNoteUpdate.map((s) => s.duration));
  });

  it("sessions are isolated between problems", async () => {
    // bring problem0 to SOLVED with 2 finished sessions
    await startProblem(testProblem0.id);
    await finishProblem(testProblem0.id, "TRIED");
    await startProblem(testProblem0.id);
    await finishProblem(testProblem0.id, "SOLVED");

    const problem0SessionsBefore = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(problem0SessionsBefore.length).toBe(2);

    // TODO -> IN_PROGRESS on problem1: new session only for problem1
    await startProblem(testProblem1.id);
    let problem1Sessions = await getSolveSessions(testUser0.id, testProblem1.id);
    expect(problem1Sessions.length).toBe(1);
    expect(problem1Sessions[0].finishedAt).toBeNull();

    // problem0 sessions are untouched
    const problem0SessionsAfter = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(problem0SessionsAfter.length).toBe(2);
    expect(problem0SessionsAfter.map((s) => s.id)).toEqual(problem0SessionsBefore.map((s) => s.id));

    // IN_PROGRESS -> SOLVED on problem1: session is finished
    await finishProblem(testProblem1.id, "SOLVED");
    problem1Sessions = await getSolveSessions(testUser0.id, testProblem1.id);
    expect(problem1Sessions.length).toBe(1);
    expect(problem1Sessions[0].finishedAt).toBeInstanceOf(Date);
    expect(await getProblemStatus(testUser0.id, testProblem1.id)).toBe("SOLVED");
  });

  it("sessions are isolated between users", async () => {
    // user0 starts problem0: only user0 has a session
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await startProblem(testProblem0.id);
    expect((await getSolveSessions(testUser0.id, testProblem0.id)).length).toBe(1);
    expect((await getSolveSessions(testUser1.id, testProblem0.id)).length).toBe(0);

    // user1 starts problem0: user0's session is untouched
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser1.id);
    await startProblem(testProblem0.id);
    expect((await getSolveSessions(testUser0.id, testProblem0.id)).length).toBe(1);
    expect((await getSolveSessions(testUser1.id, testProblem0.id)).length).toBe(1);

    // user0 solves problem0: user1's session is untouched
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser0.id);
    await finishProblem(testProblem0.id, "SOLVED");
    expect(await getProblemStatus(testUser0.id, testProblem0.id)).toBe("SOLVED");
    const user1SessionsAfterUser0Solve = await getSolveSessions(testUser1.id, testProblem0.id);
    expect(user1SessionsAfterUser0Solve.length).toBe(1);
    expect(user1SessionsAfterUser0Solve[0].finishedAt).toBeNull();

    // user1 marks tried: user0's sessions unchanged
    vi.mocked(getCurrentUserId).mockResolvedValue(testUser1.id);
    await finishProblem(testProblem0.id, "TRIED");
    expect(await getProblemStatus(testUser1.id, testProblem0.id)).toBe("TRIED");
    const user0SessionsAfterUser1Tried = await getSolveSessions(testUser0.id, testProblem0.id);
    expect(user0SessionsAfterUser1Tried.length).toBe(1);
    expect(user0SessionsAfterUser1Tried[0].finishedAt).not.toBeNull();

    // user1 restarts: user0 still has 1 session, user1 now has 2 (1 finished, 1 open)
    await startProblem(testProblem0.id);
    expect((await getSolveSessions(testUser0.id, testProblem0.id)).length).toBe(1);
    const user1Sessions = await getSolveSessions(testUser1.id, testProblem0.id);
    expect(user1Sessions.length).toBe(2);
    expect(user1Sessions.filter((s) => s.finishedAt !== null).length).toBe(1);
    expect(user1Sessions.filter((s) => s.finishedAt === null).length).toBe(1);

    // user1 solves: both sessions finished
    await finishProblem(testProblem0.id, "SOLVED");
    const user1FinalSessions = await getSolveSessions(testUser1.id, testProblem0.id);
    expect(user1FinalSessions.length).toBe(2);
    expect(user1FinalSessions.every((s) => s.finishedAt !== null)).toBe(true);
    expect(await getProblemStatus(testUser1.id, testProblem0.id)).toBe("SOLVED");
    // user0 is still untouched
    expect((await getSolveSessions(testUser0.id, testProblem0.id)).length).toBe(1);
  });
});
