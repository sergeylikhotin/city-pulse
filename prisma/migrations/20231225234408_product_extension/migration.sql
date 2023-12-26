/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productionType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityPerTimeUnit` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeUnitType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TimeUnitType" AS ENUM ('HOUR', 'TWELVE_HOURS', 'DAY', 'THREE_DAYS', 'WEEK', 'TWO_WEEKS', 'MONTH');

-- CreateEnum
CREATE TYPE "ProductProductionType" AS ENUM ('CONSUMABLE', 'PRODUCIBLE');

-- AlterTable
ALTER TABLE "BusinessBankAccountTransaction" ADD COLUMN     "contractId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
ADD COLUMN     "productionType" "ProductProductionType" NOT NULL,
ADD COLUMN     "quantityPerTimeUnit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "timeUnitType" "TimeUnitType" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- DropEnum
DROP TYPE "ProductType";
