import type { NextRequest } from "next/server";
import { POST as START_PROBLEM } from "@/app/api/problems/[id]/start/route";
import { POST as FINISH_PROBLEM } from "@/app/api/problems/[id]/finish/route";
import { PATCH as SAVE_PROBLEM } from "@/app/api/problems/[id]/save/route";
import { prisma } from "@/tests/setup";

export function startProblem(problemId: string) {
  return START_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/start`, {
      method: "POST",
    }) as unknown as NextRequest,
    { params: Promise.resolve({ id: problemId }) },
  );
}

export function finishProblem(
  problemId: string,
  newStatus: string,
  note = "",
  timeComplexity = "",
  spaceComplexity = "",
) {
  return FINISH_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/finish`, {
      method: "POST",
      body: JSON.stringify({ newStatus, note, timeComplexity, spaceComplexity }),
    }) as unknown as NextRequest,
    { params: Promise.resolve({ id: problemId }) },
  );
}

export function saveProblem(
  problemId: string,
  note = "",
  timeComplexity = "",
  spaceComplexity = "",
) {
  return SAVE_PROBLEM(
    new Request(`http://localhost/api/problems/${problemId}/save`, {
      method: "PATCH",
      body: JSON.stringify({ note, timeComplexity, spaceComplexity }),
    }) as unknown as NextRequest,
    { params: Promise.resolve({ id: problemId }) },
  );
}

export function getProblemStatus(userId: string, problemId: string) {
  return prisma.userProblem
    .findFirst({
      where: { userId, problemId },
      select: { status: true },
    })
    .then((r) => r?.status);
}

export function getSolveSessions(userId: string, problemId: string) {
  return prisma.solveSession.findMany({
    where: { userProblem: { userId, problemId } },
  });
}
