/*
  Warnings:

  - You are about to alter the column `quantity` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `quantityPerTimeUnit` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "quantityPerTimeUnit" SET DATA TYPE INTEGER;
