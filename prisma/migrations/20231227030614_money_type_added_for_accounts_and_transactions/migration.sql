/*
  Warnings:

  - The `balance` column on the `BusinessBankAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balance` column on the `PlayerBankAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unitPrice` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `amount` on the `BusinessBankAccountTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `PlayerBankAccountTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BusinessBankAccount" DROP COLUMN "balance",
ADD COLUMN     "balance" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "BusinessBankAccountTransaction" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "PlayerBankAccount" DROP COLUMN "balance",
ADD COLUMN     "balance" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PlayerBankAccountTransaction" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unitPrice",
ADD COLUMN     "unitPrice" MONEY;
