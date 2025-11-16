-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "endingKm" DOUBLE PRECISION,
ADD COLUMN     "startingKm" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
