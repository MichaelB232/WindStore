/*
Warnings:

- A unique constraint covering the columns `[public_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
- The required column `public_id` was added to the `orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

 */
-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "public_id" TEXT;
UPDATE "orders" SET "public_id" = gen_random_uuid()::text WHERE "public_id" IS NULL;
-- CreateIndex
ALTER TABLE "orders" ALTER COLUMN "public_id" SET NOT NULL;
CREATE UNIQUE INDEX "orders_public_id_key" ON "orders"("public_id");