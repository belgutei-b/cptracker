import { GET as GET_SOLVESESSIONS } from "@/app/api/solve-sessions/route";
import { NextRequest } from "next/server";

export function getSolveSessionsAPI() {
  return GET_SOLVESESSIONS(
    new Request(`http://localhost/api/solve-sessions`, {
      method: "GET",
    }) as unknown as NextRequest,
  );
}
