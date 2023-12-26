/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BankAccountTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CONSUMABLE', 'PRODUCIBLE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BankAccountTransactionType" ADD VALUE 'DEPOSIT';
ALTER TYPE "BankAccountTransactionType" ADD VALUE 'WITHDRAWAL';

-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_playerId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccountTransaction" DROP CONSTRAINT "BankAccountTransaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccountTransaction" DROP CONSTRAINT "BankAccountTransaction_toId_fkey";

-- DropTable
DROP TABLE "BankAccount";

-- DropTable
DROP TABLE "BankAccountTransaction";

-- CreateTable
CREATE TABLE "PlayerBankAccount" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlayerBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBankAccountTransaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "BankAccountTransactionType" NOT NULL,
    "fromId" TEXT,
    "toId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerBankAccountTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessBankAccount" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessBankAccountTransaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "BankAccountTransactionType" NOT NULL,
    "fromId" TEXT,
    "toId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessBankAccountTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30),
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerBankAccount_ownerId_key" ON "PlayerBankAccount"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessBankAccount_ownerId_key" ON "BusinessBankAccount"("ownerId");

-- AddForeignKey
ALTER TABLE "PlayerBankAccount" ADD CONSTRAINT "PlayerBankAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBankAccountTransaction" ADD CONSTRAINT "PlayerBankAccountTransaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "PlayerBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBankAccountTransaction" ADD CONSTRAINT "PlayerBankAccountTransaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "PlayerBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccount" ADD CONSTRAINT "BusinessBankAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccountTransaction" ADD CONSTRAINT "BusinessBankAccountTransaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "BusinessBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccountTransaction" ADD CONSTRAINT "BusinessBankAccountTransaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "BusinessBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
