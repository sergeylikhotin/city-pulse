/*
  Warnings:

  - You are about to drop the column `productId` on the `Contract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_productId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "productId";
