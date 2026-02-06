import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const currEnv = process.env.NODE_ENV;

// WARNING: running migration in prod
// const url = process.env.DB_URL_PROD;

const url =
  currEnv === "production" ? process.env.DB_URL_PROD : process.env.DB_URL_TEST;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: url,
});

const prisma = new PrismaClient({
  adapter,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
