-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "repliesCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "repliesCount" INTEGER NOT NULL DEFAULT 0;
