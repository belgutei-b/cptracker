import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** the current better-auth session, fetched at most once per request */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
