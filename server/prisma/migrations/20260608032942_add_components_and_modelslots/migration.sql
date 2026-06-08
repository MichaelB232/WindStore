/*
  Warnings:

  - You are about to drop the `Laptop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Laptop";

-- CreateTable
CREATE TABLE "laptops" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laptops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "stock" INTEGER NOT NULL,
    "specs" JSONB NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_slots" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL,
    "min_qty" INTEGER NOT NULL,
    "max_qty" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "model_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laptops_slug_key" ON "laptops"("slug");

-- AddForeignKey
ALTER TABLE "model_slots" ADD CONSTRAINT "model_slots_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "laptops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
