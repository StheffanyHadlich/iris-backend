/*
  Warnings:

  - Added the required column `user_id` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."pets" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "pets_user_id_idx" ON "public"."pets"("user_id");

-- AddForeignKey
ALTER TABLE "public"."pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
