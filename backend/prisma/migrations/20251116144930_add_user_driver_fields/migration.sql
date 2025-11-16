/*
  Warnings:

  - Added the required column `dateOfBirth` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "photo" TEXT;
