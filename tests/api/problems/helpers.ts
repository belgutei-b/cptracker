import { POST as START_PROBLEM } from "@/app/api/problems/[id]/start/route";
import { POST as FINISH_PROBLEM } from "@/app/api/problems/[id]/finish/route";
import { PATCH as SAVE_PROBLEM } from "@/app/api/problems/[id]/save/route";
import { prisma, testUser } from "@/tests/setup";

export const startProblem = (problemId: string) =>
  START_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/start`, {
      method: "POST",
    }) as any,
    { params: Promise.resolve({ id: problemId }) },
  );

export const finishProblem = (
  problemId: string,
  newStatus: string,
  { note = "", timeComplexity = "", spaceComplexity = "" } = {},
) =>
  FINISH_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/finish`, {
      method: "POST",
      body: JSON.stringify({ newStatus, note, timeComplexity, spaceComplexity }),
    }) as any,
    { params: Promise.resolve({ id: problemId }) },
  );

export const saveProblem = (
  problemId: string,
  { note = "", timeComplexity = "", spaceComplexity = "" } = {},
) =>
  SAVE_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/save`, {
      method: "PATCH",
      body: JSON.stringify({ note, timeComplexity, spaceComplexity }),
    }) as any,
    { params: Promise.resolve({ id: problemId }) },
  );

export const getProblemStatus = (problemId: string) =>
  prisma.userProblem
    .findFirst({
      where: { userId: testUser.id, problemId },
      select: { status: true },
    })
    .then((r) => r?.status);
