-- DropForeignKey
ALTER TABLE "FollowedByNotification" DROP CONSTRAINT "FollowedByNotification_followedById_fkey";

-- DropForeignKey
ALTER TABLE "FollowedByNotification" DROP CONSTRAINT "FollowedByNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "LikedByNotification" DROP CONSTRAINT "LikedByNotification_likedById_fkey";

-- DropForeignKey
ALTER TABLE "LikedByNotification" DROP CONSTRAINT "LikedByNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "LikedByNotification" DROP CONSTRAINT "LikedByNotification_threadId_fkey";

-- DropForeignKey
ALTER TABLE "RepliedByNotification" DROP CONSTRAINT "RepliedByNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "RepliedByNotification" DROP CONSTRAINT "RepliedByNotification_repliedById_fkey";

-- DropForeignKey
ALTER TABLE "RepliedByNotification" DROP CONSTRAINT "RepliedByNotification_threadId_fkey";

-- DropForeignKey
ALTER TABLE "RepostedByNotification" DROP CONSTRAINT "RepostedByNotification_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "RepostedByNotification" DROP CONSTRAINT "RepostedByNotification_repostedById_fkey";

-- DropForeignKey
ALTER TABLE "RepostedByNotification" DROP CONSTRAINT "RepostedByNotification_threadId_fkey";

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_likedById_fkey" FOREIGN KEY ("likedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedByNotification" ADD CONSTRAINT "LikedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedByNotification" ADD CONSTRAINT "FollowedByNotification_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedByNotification" ADD CONSTRAINT "FollowedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_repostedById_fkey" FOREIGN KEY ("repostedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepostedByNotification" ADD CONSTRAINT "RepostedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_repliedById_fkey" FOREIGN KEY ("repliedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepliedByNotification" ADD CONSTRAINT "RepliedByNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
