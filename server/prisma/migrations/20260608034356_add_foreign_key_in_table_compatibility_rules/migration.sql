/*
  Warnings:

  - You are about to drop the `CompatibilityRules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlotOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SlotOption" DROP CONSTRAINT "SlotOption_component_id_fkey";

-- DropForeignKey
ALTER TABLE "SlotOption" DROP CONSTRAINT "SlotOption_slot_id_fkey";

-- DropTable
DROP TABLE "CompatibilityRules";

-- DropTable
DROP TABLE "SlotOption";

-- CreateTable
CREATE TABLE "slot_option" (
    "id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "price_override_idr" BIGINT,

    CONSTRAINT "slot_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compatibility_rules" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "rules_type" "rulesType" NOT NULL,
    "condition" JSONB NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "compatibility_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "slot_option" ADD CONSTRAINT "slot_option_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "model_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_option" ADD CONSTRAINT "slot_option_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compatibility_rules" ADD CONSTRAINT "compatibility_rules_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "model_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
