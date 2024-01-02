/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `FollowedByNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `LikedByNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `RepliedByNotification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `RepostedByNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FollowedByNotification_id_key" ON "FollowedByNotification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LikedByNotification_id_key" ON "LikedByNotification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RepliedByNotification_id_key" ON "RepliedByNotification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RepostedByNotification_id_key" ON "RepostedByNotification"("id");
