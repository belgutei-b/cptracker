import { auth } from "@/lib/auth";
import { serverPostProblem } from "@/lib/problem";

/**
 * user add problem
 * @param request
 * @returns problem
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  let body: { problemLink?: string };
  try {
    body = (await request.json()) as { problemLink?: string };
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Request body must be valid JSON",
      },
      { status: 400 },
    );
  }

  if (!body.problemLink || typeof body.problemLink !== "string") {
    return Response.json(
      {
        ok: false,
        message: "problemLink is required",
      },
      { status: 400 },
    );
  }

  try {
    const res = await serverPostProblem({
      problemLink: body.problemLink,
      userId: session.user.id,
    });

    return Response.json(
      {
        ok: true,
        problem: res.problem,
        alreadyAdded: res.isAlreadyAdded,
      },
      { status: res.isAlreadyAdded ? 200 : 201 },
    );
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Failed to add problem",
      },
      { status: 500 },
    );
  }
}
