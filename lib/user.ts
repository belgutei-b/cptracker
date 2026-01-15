"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

export async function getUser({ userId }: { userId: string }) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  return user;
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
