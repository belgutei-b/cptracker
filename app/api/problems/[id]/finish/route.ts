import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Status } from "@/prisma/generated/enums";

function isStatus(value: unknown): value is Status {
  return value === "TRIED" || value === "SOLVED";
}

export async function POST(
  request: NextRequest,

  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const problemId = (await params).id;
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body: { newStatus?: Status; note?: string } = {};
    try {
      body = await request.json();
      // newStatus is either TRIED or SOLVED
      if (!isStatus(body.newStatus)) {
        throw new Error("Invalid newStatus");
      }
    } catch {
      throw new Error("newStatus is missing in body");
    }
    const now = new Date();

    let updatedDuration: number | null = null;

    await prisma.$transaction(async (tx) => {
      const existing = await tx.userProblem.findFirst({
        where: {
          userId,
          problemId,
        },
        select: {
          duration: true,
          lastStartedAt: true,
        },
      });

      if (!existing) return;

      let addSeconds = 0;
      if (existing.lastStartedAt) {
        addSeconds = Math.max(
          0,
          Math.floor((now.getTime() - existing.lastStartedAt.getTime()) / 1000),
        );
      }

      const newDuration = (existing.duration ?? 0) + addSeconds;
      updatedDuration = newDuration;

      await tx.userProblem.updateMany({
        where: {
          userId,
          problemId,
        },
        data: {
          status: body.newStatus,
          duration: newDuration,
          lastStartedAt: null,
          lastBeatAt: now,
          solvedAt: now,
          ...(typeof body.note === "string" ? { note: body.note } : {}),
        },
      });
    });

    return NextResponse.json({ ok: true, duration: updatedDuration });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      {
        status: 500,
      },
    );
  }
}
