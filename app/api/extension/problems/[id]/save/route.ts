import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/errors";
import { serverSaveProblem } from "@/lib/problem-action";

export async function PATCH(
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
    await serverSaveProblem({
      userId: session.user.id,
      problemId,
      note: body.note,
      timeComplexity: body.timeComplexity,
      spaceComplexity: body.spaceComplexity,
    });

    return Response.json({ ok: true }, { status: 200 });
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
