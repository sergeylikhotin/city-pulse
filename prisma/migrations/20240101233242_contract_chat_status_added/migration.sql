-- CreateEnum
CREATE TYPE "ContractChatStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "ContractChat" ADD COLUMN     "buyerAcceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "sellerAcceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ContractChatStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "ContractChatMessage" ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL DEFAULT false;
