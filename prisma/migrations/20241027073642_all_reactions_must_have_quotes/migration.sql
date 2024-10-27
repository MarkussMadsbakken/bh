/*
  Warnings:

  - Made the column `quoteId` on table `QuoteReaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuoteReaction" DROP CONSTRAINT "QuoteReaction_quoteId_fkey";

-- AlterTable
ALTER TABLE "QuoteReaction" ALTER COLUMN "quoteId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QuoteReaction" ADD CONSTRAINT "QuoteReaction_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
