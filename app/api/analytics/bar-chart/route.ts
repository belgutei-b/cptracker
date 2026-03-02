import { NextResponse } from "next/server";
import { getCurrentUserId, getUserTimezone } from "@/lib/user";
import { getBarChartData } from "@/lib/userStat";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timezone = (await getUserTimezone({ userId })) || "";

    // retrieving query parameters from the url
    const searchParams = request.nextUrl.searchParams;
    const rawNumberOfDays = searchParams.get("numberOfDays");

    // validate that isSolvedOnly is boolean and numberOfDays is one of 7, 14, 28

    let numberOfDays: number = 7;
    if (rawNumberOfDays) {
      // only allow past 7, 14 and 28 days
      if (rawNumberOfDays === "14") numberOfDays = 14;
      if (rawNumberOfDays === "28") numberOfDays = 28;
    }

    // call library function
    const ret = await getBarChartData({
      numberOfDays,
      userId,
      timezone,
    });

    // return
    return NextResponse.json({ data: ret }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch bar chart data", error);
    return NextResponse.json(
      { error: "Failed to fetch bar chart data" },
      { status: 500 },
    );
  }
}
