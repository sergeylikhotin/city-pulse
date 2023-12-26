/*
  Warnings:

  - You are about to drop the column `userid` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_userid_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "userid",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");
