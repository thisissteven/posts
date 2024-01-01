/*
  Warnings:

  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReplyEmbed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReplyLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReplyRepost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_threadId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyEmbed" DROP CONSTRAINT "ReplyEmbed_replyId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyLike" DROP CONSTRAINT "ReplyLike_replyId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyLike" DROP CONSTRAINT "ReplyLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyRepost" DROP CONSTRAINT "ReplyRepost_replyId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyRepost" DROP CONSTRAINT "ReplyRepost_userId_fkey";

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "replyToId" TEXT;

-- DropTable
DROP TABLE "Reply";

-- DropTable
DROP TABLE "ReplyEmbed";

-- DropTable
DROP TABLE "ReplyLike";

-- DropTable
DROP TABLE "ReplyRepost";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
