/*
  Warnings:

  - A unique constraint covering the columns `[likedById,threadId]` on the table `LikedByNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[repostedById,threadId]` on the table `RepostedByNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LikedByNotification_likedById_threadId_key" ON "LikedByNotification"("likedById", "threadId");

-- CreateIndex
CREATE UNIQUE INDEX "RepostedByNotification_repostedById_threadId_key" ON "RepostedByNotification"("repostedById", "threadId");
