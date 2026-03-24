import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/errors";
import { serverStartProblem, getUserProblemId } from "@/lib/problem-action";

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

    const res = await serverStartProblem({
      userProblemId,
      userId: session.user.id,
    });

    return Response.json(
      { ok: true, lastStartedAt: res.lastStartedAt },
      { status: 200 },
    );
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
