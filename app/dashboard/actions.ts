"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { serverAddDailyProblem, serverPostProblem } from "@/lib/problem";
import { revalidatePath } from "next/cache";

export async function actionPostProblem(link: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;

    if (!session || !userId) {
      throw new Error("Error validating session");
    }

    if (!link) {
      throw new Error("Leetcode problem link required");
    }
    if (!link.startsWith("https://leetcode.com/problems/")) {
      throw new Error("Invalid Leetcode link");
    }

    const res = await serverPostProblem({
      problemLink: link,
      userId,
    });

    if (!res) {
      throw new Error("Error in server");
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Successfully added",
    };
  } catch (err) {
    let message = "Error adding problem";
    if (err instanceof Error) {
      message = err.message;
    }
    return {
      success: false,
      message,
    };
  }
}

export async function actionDailyProblem() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;

    if (!session || !userId) {
      throw new Error("Error validating session");
    }

    const res = await serverAddDailyProblem({ userId });

    if (!res.alreadyAdded) {
      revalidatePath("/dashboard");
    }

    return {
      success: true,
      message: res.alreadyAdded
        ? "Opening daily problem"
        : "Daily problem added",
      problemId: res.problemId,
      alreadyAdded: res.alreadyAdded,
    };
  } catch (err) {
    let message = "Error adding daily problem";
    if (err instanceof Error) {
      message = err.message;
    }
    return {
      success: false,
      message,
    };
  }
}
