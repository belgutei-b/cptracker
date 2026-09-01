import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "@/lib/errors";
import { getCurrentUserId } from "@/lib/user";
import { serverDeleteUserProblem } from "@/lib/problem-action";

/**
 * User delete a problem from their UserProblem.
 * It should also remove all the SolveSessions
 * /api/problems/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userProblemId = (await params).id;

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await serverDeleteUserProblem({
      userId,
      userProblemId,
    });

    if (!res.ok) {
      throw new HttpError(500, "Unexpected error occurred");
    }

    return NextResponse.json({
      ok: true,
    });
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
