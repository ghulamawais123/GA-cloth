-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 05_marketing.sql
-- Description: Coupons, coupon usage tracking, customer reviews with moderation,
--              promotional hero banners, and site-wide configuration settings.
-- Physicality: Free shipping threshold, COD toggle, and Pakistani bank account details.
-- Idempotency: Safe to re-run; IF NOT EXISTS throughout.
-- ==============================================================================

-- 1. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type coupon_type NOT NULL, -- 'percent' or 'fixed'
  value numeric(10, 2) NOT NULL CHECK (value > 0),
  min_order numeric(12, 2) NOT NULL DEFAULT 0 CHECK (min_order >= 0),
  max_discount numeric(12, 2) CHECK (max_discount IS NULL OR max_discount > 0),
  expiry_date date NOT NULL,
  usage_limit integer NOT NULL DEFAULT 100 CHECK (usage_limit > 0),
  used_count integer NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  is_active boolean NOT NULL DEFAULT true,
  description_en text NOT NULL,
  description_ur text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

-- 2. Coupon Usages Table (Audit & Abuse Prevention)
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE RESTRICT,
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  discount_amount numeric(12, 2) NOT NULL CHECK (discount_amount >= 0),
  used_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON public.coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_order ON public.coupon_usages(order_id);

-- 3. Customer Reviews Table (Moderated & Verified Buyer Tracking)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id text REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_city text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_verified_buyer boolean NOT NULL DEFAULT false,
  status review_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- 4. Hero Banners Table (Bilingual Promotional Drops)
CREATE TABLE IF NOT EXISTS public.banners (
  id text PRIMARY KEY, -- e.g. 'ban-1', 'ban-2'
  title_en text NOT NULL,
  title_ur text NOT NULL,
  subtitle_en text NOT NULL,
  subtitle_ur text NOT NULL,
  cta_text_en text NOT NULL,
  cta_text_ur text NOT NULL,
  link text NOT NULL,
  image_url text NOT NULL,
  badge_en text,
  badge_ur text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);

-- 5. Site Settings Table (Singleton Row for Global Rates & Pakistani Accounts)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Guarantees singleton
  free_shipping_threshold numeric(12, 2) NOT NULL DEFAULT 3500 CHECK (free_shipping_threshold >= 0),
  standard_shipping_fee numeric(12, 2) NOT NULL DEFAULT 250 CHECK (standard_shipping_fee >= 0),
  cod_enabled boolean NOT NULL DEFAULT true,
  announcement_text_en text NOT NULL DEFAULT '',
  announcement_text_ur text NOT NULL DEFAULT '',
  bank_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  jazzcash_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  easypaisa_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
