/*
  Warnings:

  - A unique constraint covering the columns `[image]` on the table `UserImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserImage_image_key" ON "UserImage"("image");
