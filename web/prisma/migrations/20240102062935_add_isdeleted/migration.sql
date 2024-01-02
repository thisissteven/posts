-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_replyToId_fkey";

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
