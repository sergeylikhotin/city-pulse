-- DropForeignKey
ALTER TABLE "BankAccountTransaction" DROP CONSTRAINT "BankAccountTransaction_fromId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccountTransaction" DROP CONSTRAINT "BankAccountTransaction_toId_fkey";

-- AlterTable
ALTER TABLE "BankAccountTransaction" ALTER COLUMN "fromId" DROP NOT NULL,
ALTER COLUMN "toId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BankAccountTransaction" ADD CONSTRAINT "BankAccountTransaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccountTransaction" ADD CONSTRAINT "BankAccountTransaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
