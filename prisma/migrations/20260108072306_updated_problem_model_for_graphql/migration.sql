/*
  Warnings:

  - The values [EASY,MEDIUM,HARD] on the enum `Difficulty` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `leetcodeId` on the `Problem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleSlug` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Difficulty_new" AS ENUM ('Easy', 'Medium', 'Hard');
ALTER TABLE "Problem" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TYPE "Difficulty" RENAME TO "Difficulty_old";
ALTER TYPE "Difficulty_new" RENAME TO "Difficulty";
DROP TYPE "public"."Difficulty_old";
COMMIT;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "leetcodeId",
ADD COLUMN     "questionId" TEXT NOT NULL,
ADD COLUMN     "titleSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_link_key" ON "Problem"("link");
