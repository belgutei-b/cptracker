/*
  Warnings:

  - The primary key for the `UserProblem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `note` on the `UserProblem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5000)`.
  - You are about to alter the column `spaceComplexity` on the `UserProblem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `timeComplexity` on the `UserProblem` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `timezone` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[userId,problemId]` on the table `UserProblem` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `UserProblem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable: add id as nullable first
ALTER TABLE "UserProblem" ADD COLUMN "id" TEXT;

-- Backfill existing rows with a unique id
UPDATE "UserProblem" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- Make id NOT NULL
ALTER TABLE "UserProblem" ALTER COLUMN "id" SET NOT NULL;

-- Swap the primary key
ALTER TABLE "UserProblem" DROP CONSTRAINT "UserProblem_pkey",
ADD CONSTRAINT "UserProblem_pkey" PRIMARY KEY ("id");

-- AlterTable: cast existing columns
ALTER TABLE "UserProblem"
ALTER COLUMN "note" SET DATA TYPE VARCHAR(5000),
ALTER COLUMN "spaceComplexity" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "timeComplexity" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "timezone" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "SolveSession" (
    "id" TEXT NOT NULL,
    "userProblemId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SolveSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProblem_userId_problemId_key" ON "UserProblem"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "SolveSession" ADD CONSTRAINT "SolveSession_userProblemId_fkey" FOREIGN KEY ("userProblemId") REFERENCES "UserProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
