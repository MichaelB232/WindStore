-- AlterTable: Add is_active column to users for soft delete
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;

-- Constraint: Prevent negative stock at PostgreSQL level (Check Constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_stock_non_negative'
  ) THEN
    ALTER TABLE "products" ADD CONSTRAINT "check_stock_non_negative" CHECK ("stock" >= 0);
  END IF;
END $$;

