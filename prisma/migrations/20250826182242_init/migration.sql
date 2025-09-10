-- CreateEnum
CREATE TYPE "public"."PetStatus" AS ENUM ('AVAILABLE', 'ADOPTED', 'UNDER_TREATMENT');

-- CreateEnum
CREATE TYPE "public"."AdoptionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "race" TEXT,
    "currentWeight" DECIMAL(10,2),
    "url_photo" TEXT,
    "status" "public"."PetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "registration_date" DATE NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."adopter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "address" TEXT,

    CONSTRAINT "adopter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily" (
    "id" SERIAL NOT NULL,
    "pets_id" INTEGER NOT NULL,
    "daily_date" DATE NOT NULL,
    "weight" DECIMAL(10,2),
    "notes" TEXT,
    "prescription_notes" TEXT,

    CONSTRAINT "daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medicalHistory" (
    "id" SERIAL NOT NULL,
    "pets_id" INTEGER NOT NULL,
    "medical_date" DATE NOT NULL,
    "veterinarian" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "prescription" TEXT,

    CONSTRAINT "medicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."adoption" (
    "id" SERIAL NOT NULL,
    "pets_id" INTEGER NOT NULL,
    "adopter_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" "public"."AdoptionStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "adoption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "adopter_email_key" ON "public"."adopter"("email");

-- CreateIndex
CREATE INDEX "daily_pets_id_idx" ON "public"."daily"("pets_id");

-- CreateIndex
CREATE INDEX "medicalHistory_pets_id_idx" ON "public"."medicalHistory"("pets_id");

-- CreateIndex
CREATE INDEX "adoption_pets_id_idx" ON "public"."adoption"("pets_id");

-- CreateIndex
CREATE INDEX "adoption_adopter_id_idx" ON "public"."adoption"("adopter_id");

-- AddForeignKey
ALTER TABLE "public"."daily" ADD CONSTRAINT "daily_pets_id_fkey" FOREIGN KEY ("pets_id") REFERENCES "public"."pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medicalHistory" ADD CONSTRAINT "medicalHistory_pets_id_fkey" FOREIGN KEY ("pets_id") REFERENCES "public"."pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."adoption" ADD CONSTRAINT "adoption_pets_id_fkey" FOREIGN KEY ("pets_id") REFERENCES "public"."pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."adoption" ADD CONSTRAINT "adoption_adopter_id_fkey" FOREIGN KEY ("adopter_id") REFERENCES "public"."adopter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
