/*
  Warnings:

  - You are about to drop the column `hasUnreadNotifications` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserNotificationStatusType" AS ENUM ('READ', 'UNREAD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasUnreadNotifications";

-- CreateTable
CREATE TABLE "UserNotificationStatus" (
    "id" TEXT NOT NULL,
    "status" "UserNotificationStatusType" NOT NULL,

    CONSTRAINT "UserNotificationStatus_pkey" PRIMARY KEY ("id")
);
