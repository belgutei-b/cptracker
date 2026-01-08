"use server";

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
