/*
  Warnings:

  - You are about to drop the `_ContractChatToPlayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "ContractChatMessage" DROP CONSTRAINT "ContractChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "MarketOffer" DROP CONSTRAINT "MarketOffer_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "_ContractChatToPlayer" DROP CONSTRAINT "_ContractChatToPlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContractChatToPlayer" DROP CONSTRAINT "_ContractChatToPlayer_B_fkey";

-- DropTable
DROP TABLE "_ContractChatToPlayer";

-- CreateTable
CREATE TABLE "_BusinessToContractChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BusinessToContractChat_AB_unique" ON "_BusinessToContractChat"("A", "B");

-- CreateIndex
CREATE INDEX "_BusinessToContractChat_B_index" ON "_BusinessToContractChat"("B");

-- AddForeignKey
ALTER TABLE "MarketOffer" ADD CONSTRAINT "MarketOffer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChatMessage" ADD CONSTRAINT "ContractChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToContractChat" ADD CONSTRAINT "_BusinessToContractChat_A_fkey" FOREIGN KEY ("A") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessToContractChat" ADD CONSTRAINT "_BusinessToContractChat_B_fkey" FOREIGN KEY ("B") REFERENCES "ContractChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
