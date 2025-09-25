/*
  Warnings:

  - Made the column `user_id` on table `pets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."pets" DROP CONSTRAINT "pets_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."pets" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
