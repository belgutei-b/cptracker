import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// running migration local database
// SUPABASE_PROD_DIRECT="postgresql://cp_user:cp_pass@localhost:5432/cp?schema=public" npx prisma migrate deploy

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
