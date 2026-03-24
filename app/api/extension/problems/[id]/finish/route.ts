import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/errors";
import { serverFinishProblem, getUserProblemId } from "@/lib/problem-action";

/**
 * User finish solving problem, new status SOLVED | TRIED
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

    const userProblemId = await getUserProblemId({
      userId: session.user.id,
      problemId,
    });
    const body = await request.json();

    const res = await serverFinishProblem({
      userId: session.user.id,
      userProblemId,
      newStatus: body.newStatus,
      note: body.note,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
    });

    return Response.json({ ok: true, duration: res.duration });
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
