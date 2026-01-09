import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

/* Heartbeat */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const problemId = (await params).id;
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  await prisma.userProblem.updateMany({
    where: {
      userId,
      problemId,
      status: "IN_PROGRESS",
    },
    data: {
      lastBeatAt: now,
    },
  });
  return NextResponse.json({ ok: true });
}
