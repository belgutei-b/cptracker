import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/user";
import { HttpError } from "@/lib/errors";
import { serverStartProblem } from "@/lib/problem-action";

/* Start */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userProblemId = (await params).id;

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await serverStartProblem({
      userId,
      userProblemId,
    });

    return NextResponse.json({ ok: true, lastStartedAt: res.lastStartedAt });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json(
        { ok: false, message: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
