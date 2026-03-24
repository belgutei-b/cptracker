// start & finish problem

import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";

/**
 * Start solving a problem
 *  - create new SolveSession
 *  - if SolveSession exists, return false
 * @returns
 */
export async function serverStartProblem({
  userProblemId,
  userId,
}: {
  userProblemId: string;
  userId: string;
}) {
  if (!userId) {
    throw new HttpError(400, "userId is missing");
  }

  if (!userProblemId) {
    throw new HttpError(400, "problemId is missing");
  }

  // check if there is any active session
  const activeSession = await prisma.solveSession.findFirst({
    where: {
      userProblemId,
      finishedAt: null,
    },
  });
  if (activeSession) {
    throw new HttpError(409, "Already solving");
  }

  const now = new Date();

  // make sure that problem status is either TODO or TRIED => updating the row
  // added userId to ensure that user owns the userProblem
  const result = await prisma.userProblem.updateMany({
    where: {
      userId,
      id: userProblemId,
      status: {
        in: ["TODO", "TRIED"],
      },
    },
    data: {
      status: "IN_PROGRESS",
      lastStartedAt: now,
    },
  });

  if (result.count === 0) {
    throw new HttpError(404, "Failed to start problem");
  }

  // create a new session
  await prisma.solveSession.create({
    data: {
      userProblemId,
      startedAt: now,
    },
  });

  return {
    ok: true,
    lastStartedAt: now,
  };
}

export async function serverSaveProblem({
  userId,
  userProblemId,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  userId?: string;
  userProblemId?: string;
  note?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}) {
  if (!userId) throw new HttpError(401, "userId is missing");
  if (!userProblemId) throw new HttpError(400, "userProblemId is missing");

  if (
    typeof note !== "string" ||
    typeof timeComplexity !== "string" ||
    typeof spaceComplexity !== "string"
  ) {
    throw new HttpError(400, "Invalid field");
  }

  const result = await prisma.userProblem.updateMany({
    where: {
      userId,
      id: userProblemId,
    },
    data: {
      note,
      timeComplexity,
      spaceComplexity,
    },
  });

  if (result.count === 0) {
    throw new HttpError(400, "Error updating problem");
  }

  return {
    ok: true,
  };
}

/**
 * @returns { ok: boolean, duration?: number }
 *
 */
export async function serverFinishProblem({
  userId,
  userProblemId,
  newStatus,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  userId?: string;
  userProblemId?: string;
  newStatus?: string;
  note?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}) {
  if (!userId) throw new HttpError(401, "userId is missing");
  if (!userProblemId) throw new HttpError(400, "userProblemId is missing");

  if (!newStatus || (newStatus !== "TRIED" && newStatus !== "SOLVED")) {
    throw new HttpError(422, "Invalid status");
  }

  if (
    typeof note !== "string" ||
    typeof timeComplexity !== "string" ||
    typeof spaceComplexity !== "string"
  ) {
    throw new HttpError(400, "Invalid field");
  }

  // find active session
  let activeSession = null;
  activeSession = await prisma.solveSession.findFirst({
    where: {
      userProblemId: userProblemId,
      finishedAt: null,
    },
    select: {
      userProblem: true,
      startedAt: true,
    },
  });
  if (!activeSession) throw new HttpError(404, "active session not found");

  // update duration & status of the UserProblem
  const now = new Date();
  const sessionDuration: number =
    (now.getTime() - activeSession.startedAt.getTime()) / 1000;

  const newTotalDuration = activeSession.userProblem.duration + sessionDuration;

  // rollback if either query throws an error
  await prisma.$transaction(async (tx) => {
    const result0 = await tx.userProblem.updateMany({
      where: {
        userId,
        id: userProblemId,
      },
      data: {
        status: newStatus,
        duration: newTotalDuration,
        lastStartedAt: null,
        solvedAt: newStatus === "SOLVED" ? now : null,
        triedAt: newStatus === "TRIED" ? now : null,
        note,
        timeComplexity,
        spaceComplexity,
      },
    });
    if (result0.count === 0)
      throw new HttpError(400, "Failed to finish problem");

    const result1 = await tx.solveSession.updateMany({
      where: {
        userProblemId,
        finishedAt: null,
      },
      data: {
        finishedAt: now,
        duration: sessionDuration,
      },
    });
    if (result1.count === 0)
      throw new HttpError(400, "Failed to finish problem");
  });

  return {
    ok: true,
    duration: newTotalDuration,
  };
}
