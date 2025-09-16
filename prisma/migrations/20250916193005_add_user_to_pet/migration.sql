-- DropForeignKey
ALTER TABLE "public"."pets" DROP CONSTRAINT "pets_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."pets" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
