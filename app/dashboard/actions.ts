"use server";

import { serverPostProblem } from "../../lib/problem";
import { getSession } from "../../lib/session";
import { revalidatePath } from "next/cache";

export async function actionPostProblem(link: string) {
  try {
    const session = await getSession();
    const userId = session?.userId as string;
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
