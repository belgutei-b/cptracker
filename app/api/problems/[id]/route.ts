import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "@/lib/errors";
/**
 * User delete a problem from their UserProblem.
 * It should also remove all the SolveSession for SolveSession
 * /api/problems/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
