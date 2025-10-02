-- AlterTable
ALTER TABLE "public"."refresh_tokens" ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "user_agent" TEXT;
