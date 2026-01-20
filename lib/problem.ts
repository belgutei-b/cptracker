"use server";

import { serializeDates } from "../types/client";
import { unstable_noStore as noStore } from "next/cache";
import { getProblemData } from "./leetcode";
import prisma from "./prisma";

export async function serverPostProblem({
  problemLink,
  userId,
}: {
  problemLink: string;
  userId: string;
}) {
  const titleSlug = problemLink.split("/")[4];
  const baseLink = "https://leetcode.com/problems/" + titleSlug;

  // 1. check if problem exists in the db
  let problem = await prisma.problem.findFirst({
    where: {
      titleSlug,
    },
    select: {
      id: true,
      title: true,
      questionId: true,
    },
  });

  // 1.1 If problem doesn't exist, call leetcode graphql
  // 1.2 add problem to the db
  if (!problem) {
    const problemData = await getProblemData(titleSlug);
    if (!problemData) throw new Error("Error calling leetcode graphql");

    problem = await prisma.problem.create({
      data: {
        questionId: problemData.questionId,
        link: baseLink,
        title: problemData.title,
        titleSlug: problemData.titleSlug,
        difficulty: problemData.difficulty,
        tags: problemData.topicTags.map((tag: { name: string }) => tag.name),
      },
      select: {
        id: true,
        title: true,
        questionId: true,
      },
    });
  }

  if (!problem) throw new Error("Problem not found");
  console.log(problem);

  // 2. check if user already added this problem
  const oldUserProblem = await prisma.userProblem.findFirst({
    where: {
      userId,
      problemId: problem.id,
    },
  });

  if (oldUserProblem) {
    throw new Error("Problem already added");
  }

  // 3. add problem to the user
  const newUserProblem = await prisma.userProblem.create({
    data: {
      userId,
      problemId: problem.id,
    },
  });
  console.log(newUserProblem);
  if (!newUserProblem) {
    throw new Error("Error adding problem");
  }

  return true;
}

/**
 * retrieve problems for the user
 */
export async function getProblems({ userId }: { userId: string }) {
  noStore();
  const problems = await prisma.userProblem.findMany({
    where: {
      userId,
    },
    include: {
      problem: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return serializeDates(problems);
}
