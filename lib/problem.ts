"use server";

import { serializeDates, type UserProblemFullClient } from "@/types/client";
import { unstable_noStore as noStore } from "next/cache";
import { getLeetcodeDailyProblem, getProblemData } from "./leetcode";
import prisma from "./prisma";

async function getOrCreateProblem({
  titleSlug,
  link,
}: {
  titleSlug: string;
  link: string;
}) {
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

  if (!problem) {
    const problemData = await getProblemData(titleSlug);
    if (!problemData) throw new Error("Error calling leetcode graphql");

    problem = await prisma.problem.create({
      data: {
        questionId: problemData.questionId,
        link,
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
  return problem;
}

export async function serverPostProblem({
  problemLink,
  userId,
}: {
  problemLink: string;
  userId: string;
}): Promise<UserProblemFullClient> {
  const titleSlug = problemLink.split("/")[4];
  const baseLink = "https://leetcode.com/problems/" + titleSlug;

  // 1. check if problem exists in the db
  const problem = await getOrCreateProblem({
    titleSlug,
    link: baseLink,
  });

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
    include: {
      problem: true,
    },
  });
  if (!newUserProblem) {
    throw new Error("Error adding problem");
  }

  return serializeDates(newUserProblem) as UserProblemFullClient;
}

export async function serverAddDailyProblem({ userId }: { userId: string }) {
  const dailyLink = await getLeetcodeDailyProblem();
  if (!dailyLink) throw new Error("Error fetching daily problem");

  const fullLink = dailyLink.startsWith("http")
    ? dailyLink
    : `https://leetcode.com${dailyLink}`;

  const titleSlug = fullLink.split("/")[4];
  if (!titleSlug) throw new Error("Invalid daily problem link");

  const problem = await getOrCreateProblem({
    titleSlug,
    link: fullLink,
  });

  const existingUserProblem = await prisma.userProblem.findFirst({
    where: {
      userId,
      problemId: problem.id,
    },
    select: {
      problemId: true,
    },
  });

  if (existingUserProblem) {
    return {
      problemId: existingUserProblem.problemId,
      alreadyAdded: true,
    };
  }

  const now = new Date();
  await prisma.userProblem.create({
    data: {
      userId,
      problemId: problem.id,
      status: "IN_PROGRESS",
      lastStartedAt: now,
    },
  });

  return {
    problemId: problem.id,
    alreadyAdded: false,
  };
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
