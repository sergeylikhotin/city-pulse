-- CreateEnum
CREATE TYPE "MarketOfferType" AS ENUM ('ONE_TIME', 'PERIODIC');

-- CreateEnum
CREATE TYPE "MarketOfferStatus" AS ENUM ('OPEN', 'CLOSED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "DeliveryFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "MarketOffer" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerUnit" DECIMAL(65,30) NOT NULL,
    "offerType" "MarketOfferType" NOT NULL,
    "status" "MarketOfferStatus" NOT NULL,
    "sellerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MarketOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "termsId" TEXT,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "deliveriesLeft" INTEGER NOT NULL,
    "status" "ContractStatus" NOT NULL,
    "offerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractTerms" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerUnit" DECIMAL(65,30) NOT NULL,
    "deliveryFrequency" "DeliveryFrequency" NOT NULL,
    "deliveryTimeSlot" TEXT NOT NULL,
    "deliveriesCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractChat" (
    "id" TEXT NOT NULL,
    "termsId" TEXT,
    "offerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractChatMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "termsUpdated" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "ContractChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContractChatToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_termsId_key" ON "Contract"("termsId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractChat_termsId_key" ON "ContractChat"("termsId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContractChatToPlayer_AB_unique" ON "_ContractChatToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractChatToPlayer_B_index" ON "_ContractChatToPlayer"("B");

-- AddForeignKey
ALTER TABLE "MarketOffer" ADD CONSTRAINT "MarketOffer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketOffer" ADD CONSTRAINT "MarketOffer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "ContractTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "MarketOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChat" ADD CONSTRAINT "ContractChat_termsId_fkey" FOREIGN KEY ("termsId") REFERENCES "ContractTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChat" ADD CONSTRAINT "ContractChat_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "MarketOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChatMessage" ADD CONSTRAINT "ContractChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ContractChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractChatMessage" ADD CONSTRAINT "ContractChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractChatToPlayer" ADD CONSTRAINT "_ContractChatToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "ContractChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractChatToPlayer" ADD CONSTRAINT "_ContractChatToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
