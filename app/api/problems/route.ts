import { NextRequest, NextResponse } from "next/server";
import { getProblems, serverPostProblem } from "@/lib/problem";
import { getCurrentUserId } from "@/lib/user";

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

  const problem = await serverPostProblem({
    problemLink: body.problemLink,
    userId,
  });

  return NextResponse.json(
    {
      problem,
    },
    { status: 200 },
  );
}

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
