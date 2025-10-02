/*
  Warnings:

  - You are about to drop the column `age` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `currentWeight` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `race` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `pets` table. All the data in the column will be lost.
  - Added the required column `species` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PetSpecies" AS ENUM ('DOG', 'CAT', 'BIRD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PetSex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "public"."pets" 
DROP COLUMN "age",
DROP COLUMN "currentWeight",
DROP COLUMN "race",
DROP COLUMN "type",
ADD COLUMN "breed" TEXT,
ADD COLUMN "castrated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "color" TEXT,
ADD COLUMN "date_of_birth" TIMESTAMP(3),
ADD COLUMN "sex" "public"."PetSex" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN "species" "public"."PetSpecies" NOT NULL DEFAULT 'OTHER';
