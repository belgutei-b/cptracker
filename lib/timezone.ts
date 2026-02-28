"use server";

import prisma from "@/lib/prisma";

export async function serverPostTimezone({
  timezone,
  userId,
}: {
  timezone: string;
  userId: string;
}): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        timezone: timezone,
      },
    });
  } catch (err) {
    console.log("Error updating timezone: ", err);
    return false;
  }
  return true;
}
