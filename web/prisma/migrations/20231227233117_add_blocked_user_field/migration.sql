-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
