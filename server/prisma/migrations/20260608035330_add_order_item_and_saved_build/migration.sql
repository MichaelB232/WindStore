/*
  Warnings:

  - You are about to drop the `laptops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "compatibility_rules" DROP CONSTRAINT "compatibility_rules_model_id_fkey";

-- DropForeignKey
ALTER TABLE "model_slots" DROP CONSTRAINT "model_slots_model_id_fkey";

-- DropTable
DROP TABLE "laptops";

-- CreateTable
CREATE TABLE "laptop_models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laptop_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "configuration" JSONB NOT NULL,
    "unitPriceIdr" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_builds" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_builds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laptop_models_slug_key" ON "laptop_models"("slug");

-- AddForeignKey
ALTER TABLE "model_slots" ADD CONSTRAINT "model_slots_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "laptop_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compatibility_rules" ADD CONSTRAINT "compatibility_rules_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "laptop_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "laptop_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_builds" ADD CONSTRAINT "saved_builds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_builds" ADD CONSTRAINT "saved_builds_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "laptop_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
