/*
  Warnings:

  - You are about to drop the `_BusinessToContractChat` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `buyerId` to the `ContractChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `ContractChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BusinessToContractChat" DROP CONSTRAINT "_BusinessToContractChat_A_fkey";

-- DropForeignKey
ALTER TABLE "_BusinessToContractChat" DROP CONSTRAINT "_BusinessToContractChat_B_fkey";

-- AlterTable
ALTER TABLE "ContractChat" ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BusinessToContractChat";

-- AddForeignKey
ALTER TABLE "ContractChat" ADD CONSTRAINT "ContractChat_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChat" ADD CONSTRAINT "ContractChat_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
