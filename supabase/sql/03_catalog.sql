-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 03_catalog.sql
-- Description: Physical luxury apparel catalog schemas (categories, products,
--              variants, product images), indexes, and full-text search.
-- Physicality: Strictly physical apparel. Zero digital download/file columns.
-- Idempotency: Safe to re-run; IF NOT EXISTS throughout.
-- ==============================================================================

-- 1. Categories Table (Physical Fashion Categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY, -- e.g. 'cat-unstitched', 'cat-pret', 'cat-festive', 'cat-menswear'
  slug text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ur text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Sparkles',
  image_url text NOT NULL DEFAULT '',
  subcategories text[] NOT NULL DEFAULT '{}',
  description_en text,
  description_ur text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- 2. Products Table (Strictly Physical Pakistani Apparel)
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY, -- e.g. 'gac-prod-001'
  category_id text NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory text NOT NULL,
  title_en text NOT NULL,
  title_ur text NOT NULL,
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  sale_price numeric(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
  is_sale boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_flash_deal boolean NOT NULL DEFAULT false,
  fabric text NOT NULL, -- 'Lawn', 'Chiffon', 'Cotton', 'Jacquard', 'Silk', 'Velvet'
  piece_count piece_count_type NOT NULL DEFAULT '3-Piece',
  brand_line text NOT NULL DEFAULT 'GA LAWN COUTURE',
  description_en text NOT NULL,
  description_ur text NOT NULL,
  wash_care_en text DEFAULT 'Dry clean recommended. Gentle reverse iron with low temperature.',
  wash_care_ur text DEFAULT 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  features text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  rating numeric(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
  reviews_count integer NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  total_stock integer NOT NULL DEFAULT 0 CHECK (total_stock >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Catalog Filtering & Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_fabric ON public.products(fabric);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_flash_deal ON public.products(is_flash_deal) WHERE is_flash_deal = true;
CREATE INDEX IF NOT EXISTS idx_products_is_sale ON public.products(is_sale) WHERE is_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- GIN Index for Fast Tags Search
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN (tags);

-- Full-Text Search Vector & GIN Index (English title + description + fabric + brand)
CREATE INDEX IF NOT EXISTS idx_products_fts_en ON public.products USING GIN (
  to_tsvector('english', title_en || ' ' || description_en || ' ' || fabric || ' ' || brand_line)
);

-- 3. Product Variants Table (Physical Sizes & Colors)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id text PRIMARY KEY, -- e.g. 'v-1-0-0'
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL, -- e.g. 'Unstitched', 'Small', 'Medium', 'Large', '38 Regular'
  color text NOT NULL, -- e.g. 'Royal Emerald', 'Kashmir Maroon'
  color_hex text NOT NULL DEFAULT '#000000',
  sku text NOT NULL UNIQUE, -- e.g. 'GAC-CHI-1-U'
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price_override numeric(12, 2) CHECK (price_override IS NULL OR price_override >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON public.product_variants(stock);

-- 4. Product Images Table (Multi-image gallery & hero shots)
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_en text,
  alt_text_ur text,
  display_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON public.product_images(product_id, display_order);
