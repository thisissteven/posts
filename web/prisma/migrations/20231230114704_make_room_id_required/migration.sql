/*
  Warnings:

  - Made the column `roomIdentifier` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomIdentifier_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "roomIdentifier" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomIdentifier_fkey" FOREIGN KEY ("roomIdentifier") REFERENCES "Room"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
