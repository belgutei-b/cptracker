import { NextRequest, NextResponse } from "next/server";
import { getProblems, serverPostProblem } from "@/lib/problem";
import { getCurrentUserId } from "@/lib/user";

/**
 * user add problem
 * @param request
 * @returns created problem object
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    problemLink?: string;
  };
  if (!body.problemLink) {
    return NextResponse.json(
      {
        error: "problem url missing",
      },
      {
        status: 400,
      },
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await serverPostProblem({
    problemLink: body.problemLink,
    userId,
  });

  if (res.isAlreadyAdded) {
    return NextResponse.json({ error: "true" }, { status: 409 });
  }

  return NextResponse.json(
    {
      problem: res.problem,
    },
    { status: 200 },
  );
}

/**
 * user get all problems
 * @returns array of problem object
 */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const problems = await getProblems({
    userId,
  });

  return NextResponse.json(
    {
      problems,
    },
    { status: 200 },
  );
}
