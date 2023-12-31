/*
  Warnings:

  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'REPOST', 'FOLLOW', 'REPLY');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "userId",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- CreateTable
CREATE TABLE "LikedByNotification" (
    "id" TEXT NOT NULL,
    "likedById" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "LikedByNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedByNotification" (
    "id" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "FollowedByNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepostedByNotification" (
    "id" TEXT NOT NULL,
    "repostedById" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "RepostedByNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepliedByNotification" (
    "id" TEXT NOT NULL,
    "repliedById" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "RepliedByNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FollowedByNotification_notificationId_key" ON "FollowedByNotification"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "RepliedByNotification_notificationId_key" ON "RepliedByNotification"("notificationId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_likedById_fkey" FOREIGN KEY ("likedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedByNotification" ADD CONSTRAINT "FollowedByNotification_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedByNotification" ADD CONSTRAINT "FollowedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_repostedById_fkey" FOREIGN KEY ("repostedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_repliedById_fkey" FOREIGN KEY ("repliedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
