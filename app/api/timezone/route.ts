import { serverPostTimezone } from "@/lib/timezone";
import { getCurrentUserId } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    timezone?: string;
  };
  if (!body.timezone) {
    return NextResponse.json(
      {
        error: "timezone missing",
      },
      {
        status: 422,
      },
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await serverPostTimezone({
    timezone: body.timezone,
    userId,
  });

  if (!res) {
    return NextResponse.json(
      {
        error: "unexpected error occurred",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      message: "Successfully updated",
    },
    {
      status: 200,
    },
  );
}
