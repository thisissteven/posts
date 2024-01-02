-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "replyToId" ON "Thread"("replyToId");
