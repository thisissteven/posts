/*
  Warnings:

  - You are about to drop the column `urlEmbed` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "urlEmbed";

-- CreateTable
CREATE TABLE "Embed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT,
    "description" TEXT,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "Embed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Embed_threadId_key" ON "Embed"("threadId");

-- AddForeignKey
ALTER TABLE "Embed" ADD CONSTRAINT "Embed_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
