/*
  Warnings:

  - You are about to drop the column `threadId` on the `LikedByNotification` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `RepliedByNotification` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `RepostedByNotification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedByNotification" DROP CONSTRAINT "LikedByNotification_threadId_fkey";

-- DropForeignKey
ALTER TABLE "RepliedByNotification" DROP CONSTRAINT "RepliedByNotification_threadId_fkey";

-- DropForeignKey
ALTER TABLE "RepostedByNotification" DROP CONSTRAINT "RepostedByNotification_threadId_fkey";

-- DropIndex
DROP INDEX "LikedByNotification_likedById_threadId_key";

-- DropIndex
DROP INDEX "RepostedByNotification_repostedById_threadId_key";

-- AlterTable
ALTER TABLE "LikedByNotification" DROP COLUMN "threadId";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "threadId" TEXT;

-- AlterTable
ALTER TABLE "RepliedByNotification" DROP COLUMN "threadId";

-- AlterTable
ALTER TABLE "RepostedByNotification" DROP COLUMN "threadId";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
