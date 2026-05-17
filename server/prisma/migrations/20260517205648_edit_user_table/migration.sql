/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerificationTokenExpires" TIMESTAMP(3),
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;
