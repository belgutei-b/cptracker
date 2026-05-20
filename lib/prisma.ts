import "dotenv/config";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getDatabaseUrl() {
  const currEnv = process.env.NODE_ENV;
  let url = "";
  if (currEnv === "production") url = process.env.SUPABASE_PROD_URL ?? "";
  else if (currEnv === "development") url = process.env.DB_URL_DEV ?? "";
  else url = process.env.DB_URL_TEST ?? "";

  if (!url) {
    throw new Error(`Missing database URL for NODE_ENV=${currEnv}`);
  }

  return url;
}

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
