-- CreateTable
CREATE TABLE "slotOption" (
    "id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "component_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "price_override_idr" BIGINT,

    CONSTRAINT "slotOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "slotOption" ADD CONSTRAINT "slotOption_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "model_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slotOption" ADD CONSTRAINT "slotOption_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;
