import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Status } from "@/prisma/generated/prisma/enums";

export async function POST() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const staleThreshold = new Date(now.getTime() - 1 * 60 * 1000);
  const cutoff = new Date(now.getTime() - 1 * 60 * 1000);

  const staleInProgress = await prisma.userProblem.findMany({
    where: {
      userId,
      status: Status.IN_PROGRESS,
      lastBeatAt: {
        lt: staleThreshold,
      },
    },
    select: {
      problemId: true,
      duration: true,
      lastStartedAt: true,
      lastBeatAt: true,
    },
  });

  if (staleInProgress.length > 0) {
    console.log("stale problems: ", staleInProgress.length);
    await prisma.$transaction(
      staleInProgress.map((p) => {
        let addSeconds = 0;
        if (p.lastStartedAt && p.lastBeatAt) {
          addSeconds = Math.max(
            0,
            Math.floor(
              (p.lastBeatAt.getTime() - p.lastStartedAt.getTime()) / 1000,
            ),
          );
        }

        const newDuration = (p.duration ?? 0) + addSeconds;

        return prisma.userProblem.updateMany({
          where: {
            userId,
            problemId: p.problemId,
          },
          data: {
            status: Status.TRIED,
            duration: newDuration,
            lastStartedAt: null,
            lastBeatAt: null,
          },
        });
      }),
    );
  }

  await prisma.userProblem.updateMany({
    where: {
      userId,
      status: Status.IN_PROGRESS,
      lastBeatAt: {
        gte: cutoff,
      },
    },
    data: {
      lastBeatAt: now,
    },
  });

  return NextResponse.json({ ok: true, beatAt: now.toISOString() });
}
