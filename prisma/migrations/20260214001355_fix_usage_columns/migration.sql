/*
  Warnings:

  - You are about to drop the column `Points` on the `usage` table. All the data in the column will be lost.
  - Added the required column `points` to the `usage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usage" DROP COLUMN "Points",
ADD COLUMN     "points" INTEGER NOT NULL;
