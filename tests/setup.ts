import { vi, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DB_URL_TEST ||
    "postgresql://cp_user:cp_pass@localhost:5432/cp?schema=public",
});
export const prisma = new PrismaClient({ adapter });

export const testUser = {
  id: "fu4j7StTfBnVzq6aC8t5igpMUp6Zd74N",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
};

export const testProblem = {
  id: "cmmvhlad00004uw0zalksq4zq",
  link: "https://leetcode.com/problems/two-sum",
  title: "Two Sum",
  titleSlug: "two-sum",
  questionId: "1",
  difficulty: "Easy" as const,
  tags: ["Array", "Hash Table"],
};

/* runs before it() */
beforeEach(async () => {
  vi.resetAllMocks();
  await prisma.userProblem.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.create({ data: testUser });
  await prisma.problem.create({ data: testProblem });
});

afterAll(async () => {
  await prisma.$disconnect();
});
