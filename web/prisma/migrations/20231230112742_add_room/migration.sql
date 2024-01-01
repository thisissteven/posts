/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverId",
ADD COLUMN     "roomIdentifier" TEXT;

-- CreateTable
CREATE TABLE "Room" (
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomIdentifier_fkey" FOREIGN KEY ("roomIdentifier") REFERENCES "Room"("identifier") ON DELETE SET NULL ON UPDATE CASCADE;
