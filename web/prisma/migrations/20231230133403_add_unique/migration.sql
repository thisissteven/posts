/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_senderId_key" ON "Room"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_receiverId_key" ON "Room"("receiverId");
