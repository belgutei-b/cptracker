import { vi, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    process.env.DB_URL_TEST ||
    "postgresql://cp_user:cp_pass@localhost:5432/cp?schema=public",
});
export const prisma = new PrismaClient({ adapter });

export const testUser0 = {
  id: "fu4j7StTfBnVzq6aC8t5igpMUp6Zd74N",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
};

export const testUser1 = {
  id: "y92CPHM17Dq7wXWw52hMpXlHBZUTcofh",
  name: "rose",
  email: "rose@blackpink.com",
  emailVerified: true,
};

export const testProblem0 = {
  id: "cmmvhlad00004uw0zalksq4zq",
  link: "https://leetcode.com/problems/two-sum",
  title: "Two Sum",
  titleSlug: "two-sum",
  questionId: "1",
  difficulty: "Easy" as const,
  tags: ["Array", "Hash Table"],
};

export const testProblem1 = {
  id: "cmm8iy77n0003u10z4holt5ut",
  link: "https://leetcode.com/problems/median-of-two-sorted-arrays",
  title: "Median of Two Sorted Arrays",
  titleSlug: "median-of-two-sorted-arrays",
  questionId: "4",
  difficulty: "Hard" as const,
  tags: ["Array", "Binary Search", "Divide and Conquer"],
};

/* runs before it() */
beforeEach(async () => {
  vi.resetAllMocks();
  await prisma.userProblem.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.create({ data: testUser0 });
  await prisma.user.create({ data: testUser1 });
  await prisma.problem.create({ data: testProblem0 });
  await prisma.problem.create({ data: testProblem1 });
});

afterAll(async () => {
  await prisma.$disconnect();
});
