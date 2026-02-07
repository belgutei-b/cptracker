/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProblem" ADD COLUMN     "spaceComplexity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timeComplexity" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "passwordHash";
