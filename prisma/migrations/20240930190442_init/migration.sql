/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "City";

-- CreateTable
CREATE TABLE "Marker" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "curiosity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marker_pkey" PRIMARY KEY ("id")
);
