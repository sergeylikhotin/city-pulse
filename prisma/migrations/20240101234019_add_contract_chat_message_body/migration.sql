/*
  Warnings:

  - You are about to drop the column `message` on the `ContractChatMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContractChatMessage" DROP COLUMN "message",
ADD COLUMN     "body" TEXT;
