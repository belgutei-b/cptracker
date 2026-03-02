"use server";

import prisma from "@/lib/prisma";
import { IANAZone } from "luxon";

export async function serverPostTimezone({
  timezone,
  userId,
}: {
  timezone: string;
  userId: string;
}): Promise<boolean> {
  // checking the timezone
  if (!IANAZone.isValidZone(timezone)) {
    return false;
  }

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
