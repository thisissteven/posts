/*
  Warnings:

  - You are about to drop the column `userId` on the `ThreadReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ThreadReport" DROP CONSTRAINT "ThreadReport_userId_fkey";

-- AlterTable
ALTER TABLE "ThreadReport" DROP COLUMN "userId",
ADD COLUMN     "reporterId" TEXT;

-- AddForeignKey
ALTER TABLE "ThreadReport" ADD CONSTRAINT "ThreadReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
