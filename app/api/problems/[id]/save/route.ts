import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/user";
import { serverSaveProblem } from "@/lib/problem-action";
import { HttpError } from "@/lib/errors";

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

    const body = await request.json();

    await serverSaveProblem({
      userId,
      problemId,
      note: body.note,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json(
        { ok: false, message: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
