/*
  Warnings:

  - You are about to drop the `slotOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "slotOption" DROP CONSTRAINT "slotOption_component_id_fkey";

-- DropForeignKey
ALTER TABLE "slotOption" DROP CONSTRAINT "slotOption_slot_id_fkey";

-- DropTable
DROP TABLE "slotOption";

-- CreateTable
CREATE TABLE "SlotOption" (
    "id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "price_override_idr" BIGINT,

    CONSTRAINT "SlotOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlotOption" ADD CONSTRAINT "SlotOption_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "model_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotOption" ADD CONSTRAINT "SlotOption_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;
