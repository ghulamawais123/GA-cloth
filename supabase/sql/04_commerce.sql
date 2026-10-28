-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 04_commerce.sql
-- Description: Orders, line items, cart persistence, physical customer addresses,
--              payments, manual payment proofs, TCS shipments, and timeline logs.
-- Physicality: Physical Pakistani apparel orders exclusively with TCS courier.
-- Idempotency: Safe to re-run; IF NOT EXISTS throughout.
-- ==============================================================================

-- 1. Customer Addresses Table (Saved Shipping Addresses)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home', -- 'Home', 'Office', etc.
  province text NOT NULL, -- 'Punjab', 'Sindh', 'KPK', etc.
  city text NOT NULL, -- 'Lahore', 'Karachi', 'Islamabad', etc.
  street_address text NOT NULL,
  phone text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON public.customer_addresses(user_id);

-- 2. Shopping Carts Table (Logged-in or Guest session)
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text, -- For guest cart continuity
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_cart_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_carts_session_token ON public.carts(session_token);

-- 3. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id text NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_cart_items_variant UNIQUE (cart_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);

-- 4. Orders Table (Supports Guest Checkout & Registered Accounts)
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY, -- e.g. 'GAC-89241'
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL indicates Guest Checkout
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_province text NOT NULL,
  shipping_city text NOT NULL,
  shipping_address text NOT NULL,
  delivery_notes text,
  subtotal numeric(12, 2) NOT NULL CHECK (subtotal >= 0),
  discount numeric(12, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  applied_coupon text,
  shipping_fee numeric(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total numeric(12, 2) NOT NULL CHECK (total >= 0),
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_reference_number text, -- Bank TRX ID or JazzCash/Easypaisa Ref
  payment_proof_url text, -- Storage link or public URL of receipt screenshot
  order_status order_status NOT NULL DEFAULT 'placed',
  tcs_tracking_number text, -- Assigned TCS consignment number, e.g. 'TCS-92837412PK'
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Fast Indexing for Order Queries, Tracking, and Admin Filters
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_tcs ON public.orders(tcs_tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. Order Line Items Table (Physical Garment Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id text NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  title_en text NOT NULL,
  size text NOT NULL,
  color text NOT NULL,
  sku text NOT NULL,
  unit_price numeric(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  line_total numeric(12, 2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

-- 6. Payments Table (Financial Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  reference_number text,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  payment_channel text, -- 'Meezan Bank', 'JazzCash', 'Easypaisa', 'Card 3DS'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 7. Payment Proofs Table (Screenshots uploaded for manual admin review)
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  proof_url text NOT NULL,
  reference_number text,
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON public.payment_proofs(order_id);

-- 8. Shipments Table (Physical Courier Dispatches via TCS)
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier text NOT NULL DEFAULT 'TCS',
  tracking_number text NOT NULL,
  status shipment_status NOT NULL DEFAULT 'assigned',
  dispatched_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);

-- 9. Order Status History Table (Bilingual Customer Timeline)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note_en text NOT NULL,
  note_ur text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id, created_at ASC);
