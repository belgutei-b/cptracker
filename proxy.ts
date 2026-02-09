import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

const protectedRoutes = ["/profile", "/dashboard", "/analytics"];
const authRoutes = ["/auth"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.session) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  if (isAuthRoute && session?.session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
