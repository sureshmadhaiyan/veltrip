/*
  Warnings:

  - You are about to drop the column `vehicleColor` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleModel` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleNumber` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `drivers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED');

-- DropIndex
DROP INDEX "drivers_vehicleNumber_key";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "vehicleColor",
DROP COLUMN "vehicleModel",
DROP COLUMN "vehicleNumber",
DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleId" TEXT;

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleModel" TEXT,
    "vehicleColor" TEXT,
    "year" INTEGER,
    "registrationDate" TIMESTAMP(3),
    "insuranceExpiry" TIMESTAMP(3),
    "permitExpiry" TIMESTAMP(3),
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vehicleNumber_key" ON "vehicles"("vehicleNumber");

-- CreateIndex
CREATE INDEX "vehicles_companyId_idx" ON "vehicles"("companyId");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE INDEX "vehicles_vehicleNumber_idx" ON "vehicles"("vehicleNumber");

-- CreateIndex
CREATE INDEX "drivers_vehicleId_idx" ON "drivers"("vehicleId");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
