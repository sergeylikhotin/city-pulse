-- AlterTable
ALTER TABLE "ContractChat" ADD COLUMN     "closerId" TEXT;

-- AddForeignKey
ALTER TABLE "ContractChat" ADD CONSTRAINT "ContractChat_closerId_fkey" FOREIGN KEY ("closerId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
