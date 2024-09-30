-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "curiosity" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);
