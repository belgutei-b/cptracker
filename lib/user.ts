"use server";

import prisma from "./prisma";
import { getSession } from "./session";

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
  const session = await getSession();
  if (session) {
    const userId = session.userId as string;
    return userId;
  }
  return null;
}
