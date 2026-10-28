-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 06_inventory_audit.sql
-- Description: Physical inventory stock movements ledger and administrative
--              audit logging for tracking changes across the platform.
-- Physicality: Physical stock ledger for apparel variants.
-- Idempotency: Safe to re-run; IF NOT EXISTS throughout.
-- ==============================================================================

-- 1. Stock Movements Table (Variant Inventory Tracking Ledger)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id text NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount integer NOT NULL, -- Negative for deductions (orders), positive for restocks
  previous_stock integer NOT NULL,
  new_stock integer NOT NULL,
  reason text NOT NULL, -- 'order_placed', 'order_cancelled', 'manual_adjustment', 'initial_seed'
  reference_id text, -- e.g. order number 'GAC-89241' or shipment consignment
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_variant ON public.stock_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON public.stock_movements(reference_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at DESC);

-- 2. Audit Logs Table (Administrative Operations & Safety Auditing)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'PAYMENT_VERIFIED'
  entity_type text NOT NULL, -- 'order', 'product', 'variant', 'coupon', 'settings'
  entity_id text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
