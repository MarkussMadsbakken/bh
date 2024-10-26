/*
  Warnings:

  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstname" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "QuoteReaction" (
    "id" SERIAL NOT NULL,
    "reaction" TEXT NOT NULL,
    "quoteId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "QuoteReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fine" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fine_quoteId_key" ON "Fine"("quoteId");

-- AddForeignKey
ALTER TABLE "QuoteReaction" ADD CONSTRAINT "QuoteReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteReaction" ADD CONSTRAINT "QuoteReaction_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
