-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_replyToId_fkey";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
