import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/errors";
import { serverFinishProblem } from "@/lib/problem-action";

/**
 * User finish solving problem
 * @param request
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const problemId = (await params).id;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    await serverFinishProblem({
      userId: session.user.id,
      problemId,
      newStatus: body.newStatus,
      note: body.note,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
    });

    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json(
        { ok: false, message: err.message },
        { status: err.status },
      );
    }

    return Response.json(
      { ok: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
