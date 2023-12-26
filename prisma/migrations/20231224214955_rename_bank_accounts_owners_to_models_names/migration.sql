/*
  Warnings:

  - You are about to drop the column `ownerId` on the `BusinessBankAccount` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `PlayerBankAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId]` on the table `BusinessBankAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playerId]` on the table `PlayerBankAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `BusinessBankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `PlayerBankAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessBankAccount" DROP CONSTRAINT "BusinessBankAccount_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerBankAccount" DROP CONSTRAINT "PlayerBankAccount_ownerId_fkey";

-- DropIndex
DROP INDEX "BusinessBankAccount_ownerId_key";

-- DropIndex
DROP INDEX "PlayerBankAccount_ownerId_key";

-- AlterTable
ALTER TABLE "BusinessBankAccount" DROP COLUMN "ownerId",
ADD COLUMN     "businessId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerBankAccount" DROP COLUMN "ownerId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessBankAccount_businessId_key" ON "BusinessBankAccount"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerBankAccount_playerId_key" ON "PlayerBankAccount"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerBankAccount" ADD CONSTRAINT "PlayerBankAccount_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccount" ADD CONSTRAINT "BusinessBankAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
