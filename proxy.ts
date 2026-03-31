import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth, authBaseURL } from "@/lib/auth";

const protectedRoutes = [
  "/profile",
  "/dashboard",
  "/analytics",
  "/extension-auth",
  "/extension-auth/privacy-policy",
];
const authRoutes = ["/auth"];
const ALLOWED_WEB_ORIGIN = new URL(authBaseURL).origin;

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/extension")) {
    // TODO: after extension gets updated in web store, uncomment
    // const origin = req.headers.get("origin");
    // if (origin !== extensionOrigin) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }
    return NextResponse.next();
  }

  if (path.startsWith("/api") && !path.startsWith("/api/auth")) {
    // origin is only sent in cross-origin requests
    const origin = req.headers.get("origin");
    if (origin !== null && origin !== ALLOWED_WEB_ORIGIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to /login if the user is not authenticated
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
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
