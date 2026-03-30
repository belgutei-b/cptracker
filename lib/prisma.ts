import "dotenv/config";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const currEnv = process.env.NODE_ENV;

const url =
  currEnv === "production"
    ? process.env.SUPABASE_PROD_URL
    : currEnv === "test"
      ? process.env.DB_URL_TEST
      : process.env.DB_URL_DEV;

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
