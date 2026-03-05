// start & finish problem

import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/errors";

export async function serverStartProblem({
  problemId,
  userId,
}: {
  problemId: string;
  userId: string;
}) {
  if (!userId) {
    throw new HttpError(400, "userId is missing");
  }

  if (!problemId) {
    throw new HttpError(400, "problemId is missing");
  }

  const now = new Date();

  const result = await prisma.userProblem.updateMany({
    where: {
      userId,
      problemId,
      status: {
        notIn: ["SOLVED"],
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

  return {
    ok: true,
    lastStartedAt: now.toISOString(),
  };
}

export async function serverSaveProblem({
  userId,
  problemId,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  userId?: string;
  problemId?: string;
  note?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}) {
  if (!userId) throw new HttpError(401, "userId is missing");
  if (!problemId) throw new HttpError(400, "problemId is missing");

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
      problemId,
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

export async function serverFinishProblem({
  userId,
  problemId,
  newStatus,
  note,
  timeComplexity,
  spaceComplexity,
}: {
  userId?: string;
  problemId?: string;
  newStatus?: string;
  note?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}) {
  if (!userId) throw new HttpError(401, "userId is missing");
  if (!problemId) throw new HttpError(400, "problemId is missing");

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

  let problem = null;
  try {
    problem = await prisma.userProblem.findUniqueOrThrow({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
        status: "IN_PROGRESS",
      },
      select: {
        duration: true,
        lastStartedAt: true,
      },
    });
  } catch (_err) {
    throw new HttpError(404, "Problem not found");
  }

  if (!problem) throw new HttpError(404, "Problem not found");

  let addSeconds: number = 0;
  const now = new Date();
  if (problem.lastStartedAt) {
    addSeconds += Math.floor(
      (now.getTime() - problem.lastStartedAt.getTime()) / 1000,
    );
  }

  const newDuration = problem.duration + addSeconds;

  const result = await prisma.userProblem.updateMany({
    where: {
      userId,
      problemId,
    },
    data: {
      status: newStatus,
      duration: newDuration,
      lastStartedAt: null,
      solvedAt: newStatus === "SOLVED" ? now : null,
      triedAt: newStatus === "TRIED" ? now : null,
      note,
      timeComplexity,
      spaceComplexity,
    },
  });

  if (result.count === 0) {
    throw new HttpError(400, "Failed to finish problem");
  }

  return {
    ok: true,
    duration: newDuration,
  };
}
