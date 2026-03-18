import { vi, beforeEach, afterAll, beforeAll } from "vitest";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DB_URL_TEST! });
export const prisma = new PrismaClient({ adapter });

export const testUser = {
  id: "fu4j7StTfBnVzq6aC8t5igpMUp6Zd74N",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
};

/* runs before it() */
beforeEach(async () => {
  vi.resetAllMocks();
  await prisma.userProblem.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.create({ data: testUser });
});

afterAll(async () => {
  await prisma.$disconnect();
});
