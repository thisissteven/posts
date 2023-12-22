/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `personId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personId_fkey";

-- DropIndex
DROP INDEX "Account_ownerId_key";

-- DropIndex
DROP INDEX "User_ownerId_key";

-- DropIndex
DROP INDEX "User_personId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "ownerId",
DROP COLUMN "personId",
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "Owner";

-- DropTable
DROP TABLE "Person";
