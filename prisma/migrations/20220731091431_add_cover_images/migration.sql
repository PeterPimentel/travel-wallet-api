-- AlterTable
ALTER TABLE "Travel" ADD COLUMN     "budget" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Cover" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);
