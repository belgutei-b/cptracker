import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/user";
import { serverFinishProblem } from "@/lib/problem-action";
import { HttpError } from "@/lib/errors";

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

    const body = await request.json();
    const res = await serverFinishProblem({
      userId,
      problemId,
      newStatus: body.newStatus,
      note: body.note,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
    });

    return NextResponse.json({ ok: true, duration: res.duration });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json(
        { ok: false, message: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { message: "Unexpected error occurred" },
      {
        status: 500,
      },
    );
  }
}
