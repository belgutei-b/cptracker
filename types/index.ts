import { Prisma } from "../app/generated/prisma/client";
import { Difficulty } from "../app/generated/prisma/enums";

export interface ProblemLeetcodeAPI {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: Difficulty;
  topicTags: {
    name: string;
    slug: string;
  }[];
}

export type UserProblemFull = Prisma.UserProblemGetPayload<{
  include: { problem: true };
}>;
