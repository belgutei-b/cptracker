-- AlterTable
ALTER TABLE "UserProblem" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "solvedAt" TIMESTAMP(3);
