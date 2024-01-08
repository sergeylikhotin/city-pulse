/*
  Warnings:

  - Made the column `termsId` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_termsId_fkey";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "completedAt" TIMESTAMP(3),
ALTER COLUMN "termsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "ContractTerms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
