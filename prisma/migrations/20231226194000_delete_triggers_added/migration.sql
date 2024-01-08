-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessBankAccount" DROP CONSTRAINT "BusinessBankAccount_businessId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessBankAccountTransaction" DROP CONSTRAINT "BusinessBankAccountTransaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessBankAccountTransaction" DROP CONSTRAINT "BusinessBankAccountTransaction_toId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerBankAccount" DROP CONSTRAINT "PlayerBankAccount_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerBankAccountTransaction" DROP CONSTRAINT "PlayerBankAccountTransaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerBankAccountTransaction" DROP CONSTRAINT "PlayerBankAccountTransaction_toId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_businessId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerBankAccount" ADD CONSTRAINT "PlayerBankAccount_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBankAccountTransaction" ADD CONSTRAINT "PlayerBankAccountTransaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "PlayerBankAccount"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBankAccountTransaction" ADD CONSTRAINT "PlayerBankAccountTransaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "PlayerBankAccount"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccount" ADD CONSTRAINT "BusinessBankAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccountTransaction" ADD CONSTRAINT "BusinessBankAccountTransaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "BusinessBankAccount"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBankAccountTransaction" ADD CONSTRAINT "BusinessBankAccountTransaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "BusinessBankAccount"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
