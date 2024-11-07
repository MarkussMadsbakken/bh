/*
  Warnings:

  - Made the column `quoteId` on table `Fine` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_quoteId_fkey";

-- AlterTable
ALTER TABLE "Fine" ALTER COLUMN "quoteId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
