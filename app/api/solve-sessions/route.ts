import { NextRequest, NextResponse } from "next/server";

/**
 * solve sessions of the authenticated user
 * @returns SolveSession[]
 */
export async function GET(request: NextRequest) {
  return NextResponse.json([]);
}
