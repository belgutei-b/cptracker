/*
  Warnings:

  - You are about to drop the column `lastBeatAt` on the `UserProblem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProblem" DROP COLUMN "lastBeatAt",
ADD COLUMN     "triedAt" TIMESTAMP(3);
