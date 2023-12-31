/*
  Warnings:

  - You are about to drop the column `urlEmbed` on the `Reply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "urlEmbed",
ADD COLUMN     "embedId" TEXT;

-- CreateTable
CREATE TABLE "ReplyEmbed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT,
    "image" TEXT,
    "title" TEXT,
    "description" TEXT,
    "replyId" TEXT NOT NULL,

    CONSTRAINT "ReplyEmbed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReplyEmbed_replyId_key" ON "ReplyEmbed"("replyId");

-- AddForeignKey
ALTER TABLE "ReplyEmbed" ADD CONSTRAINT "ReplyEmbed_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
