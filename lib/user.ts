"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";
import { IANAZone } from "luxon";

export async function getProfileOverview({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
      email: true,
      createdAt: true,
      accounts: {
        select: {
          providerId: true,
          accountId: true,
        },
      },
    },
  });

  if (!user) return null;

  const providers = Array.from(new Set(user.accounts.map((a) => a.providerId)));
  const githubAccountId =
    user.accounts.find((a) => a.providerId === "github")?.accountId ?? null;

  const identity =
    user.username?.trim() ||
    (githubAccountId ? `@${githubAccountId}` : null) ||
    user.email ||
    "Unknown User";

  return {
    identity,
    providers,
    createdAt: user.createdAt,
  };
}

export async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    const userId = session.user.id;
    return userId;
  }
  return null;
}

export async function getUserTimezone({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      timezone: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  let tz = user.timezone || "UTC";
  if (!IANAZone.isValidZone(tz)) tz = "UTC";
  return tz;
}
