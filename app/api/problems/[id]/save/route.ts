import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const problemId = (await params).id;
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      note?: unknown;
      timeComplexity?: unknown;
      spaceComplexity?: unknown;
    };

    const data: {
      note?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
    } = {};

    if (typeof body.note === "string") data.note = body.note;
    if (typeof body.timeComplexity === "string")
      data.timeComplexity = body.timeComplexity;
    if (typeof body.spaceComplexity === "string")
      data.spaceComplexity = body.spaceComplexity;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 },
      );
    }

    const existing = await prisma.userProblem.findFirst({
      where: {
        userId,
        problemId,
      },
      select: {
        status: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (existing.status !== "TRIED" && existing.status !== "SOLVED") {
      return NextResponse.json(
        { error: "Save is only available for tried/solved problems" },
        { status: 400 },
      );
    }

    await prisma.userProblem.updateMany({
      where: {
        userId,
        problemId,
      },
      data,
    });

    const updated = await prisma.userProblem.findFirst({
      where: {
        userId,
        problemId,
      },
      select: {
        note: true,
        timeComplexity: true,
        spaceComplexity: true,
      },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
