/*
  Warnings:

  - You are about to drop the column `amount` on the `BankAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "amount",
ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0;
