-- CreateEnum
CREATE TYPE "rulesType" AS ENUM ('requires', 'forbids', 'max_qty', 'max_sum');

-- CreateTable
CREATE TABLE "CompatibilityRules" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "rules_type" "rulesType" NOT NULL,
    "condition" JSONB NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "CompatibilityRules_pkey" PRIMARY KEY ("id")
);
