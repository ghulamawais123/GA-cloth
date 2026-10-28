-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 09_storage.sql
-- Description: Supabase Storage buckets creation and access control policies.
-- Buckets:
--   1. 'product-images' (Public Read, Staff Write)
--   2. 'banners' (Public Read, Staff Write)
--   3. 'site-assets' (Public Read, Staff Write)
--   4. 'payment-proofs' (Private; Restricted Upload, Staff-Only Read)
-- Idempotency: Uses ON CONFLICT DO UPDATE for buckets & DROP POLICY IF EXISTS.
-- ==============================================================================

-- 1. Create Buckets in storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB limit for high-res apparel photos
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'banners',
    'banners',
    true,
    10485760, -- 10MB limit for promotional campaign imagery
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'site-assets',
    'site-assets',
    true,
    5242880, -- 5MB limit for logos, icons, badges
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'payment-proofs',
    'payment-proofs',
    false, -- STRICTLY PRIVATE: Contains customer bank slips & transaction receipts
    5242880, -- 5MB max receipt upload
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
  )
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. PUBLIC BUCKET POLICIES (product-images, banners, site-assets)
-- ==============================================================================

-- Public Read for Catalog & Marketing Media
DROP POLICY IF EXISTS "public_view_media_buckets" ON storage.objects;
CREATE POLICY "public_view_media_buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'banners', 'site-assets'));

-- Staff-Only Upload for Catalog & Marketing Media
DROP POLICY IF EXISTS "staff_upload_media_buckets" ON storage.objects;
CREATE POLICY "staff_upload_media_buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('product-images', 'banners', 'site-assets')
    AND public.is_staff()
  );

-- Staff-Only Update for Catalog & Marketing Media
DROP POLICY IF EXISTS "staff_update_media_buckets" ON storage.objects;
CREATE POLICY "staff_update_media_buckets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('product-images', 'banners', 'site-assets')
    AND public.is_staff()
  )
  WITH CHECK (
    bucket_id IN ('product-images', 'banners', 'site-assets')
    AND public.is_staff()
  );

-- Staff-Only Delete for Catalog & Marketing Media
DROP POLICY IF EXISTS "staff_delete_media_buckets" ON storage.objects;
CREATE POLICY "staff_delete_media_buckets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('product-images', 'banners', 'site-assets')
    AND public.is_admin()
  );

-- ==============================================================================
-- 3. PRIVATE PAYMENT PROOFS POLICIES (payment-proofs)
-- ==============================================================================

-- Receipt Screenshot Upload: Allowed for customers or guests placing orders
-- Enforces: 5MB limit and image file extensions
DROP POLICY IF EXISTS "upload_payment_proof" ON storage.objects;
CREATE POLICY "upload_payment_proof"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-proofs'
    -- Ensure file extension is an image
    AND (
      lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'heic')
    )
  );

-- Reading Payment Proofs: Strictly staff only (Confidential financial privacy)
DROP POLICY IF EXISTS "staff_view_payment_proofs" ON storage.objects;
CREATE POLICY "staff_view_payment_proofs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-proofs'
    AND public.is_staff()
  );

-- Deleting Payment Proofs: Strictly administrators only
DROP POLICY IF EXISTS "admin_delete_payment_proofs" ON storage.objects;
CREATE POLICY "admin_delete_payment_proofs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'payment-proofs'
    AND public.is_admin()
  );
