/*
  Warnings:

  - You are about to drop the column `sessionId` on the `ContractChatMessage` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `ContractChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContractChatMessage" DROP CONSTRAINT "ContractChatMessage_sessionId_fkey";

-- AlterTable
ALTER TABLE "ContractChatMessage" DROP COLUMN "sessionId",
ADD COLUMN     "chatId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ContractChatMessage" ADD CONSTRAINT "ContractChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ContractChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
