-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 08_rls_policies.sql
-- Description: Row Level Security (RLS) enforcement across all tables.
-- Security Model:
--   - Public: Read active catalog, approved reviews, active banners, site settings.
--   - Customers: Read/write own profile, addresses, cart, orders, reviews.
--   - Guest Orders: Direct table INSERT/SELECT blocked. Must use place_order() & track_order() RPCs.
--   - Support Staff: View/update orders, shipments, payment verification, moderate reviews.
--   - Managers: Manage catalog (products, variants, categories), inventory, coupons, banners.
--   - Super Admin: Full system access including staff role assignment and site settings.
--   - Anti-Escalation: Users CANNOT alter user_roles table directly under any circumstance.
-- Idempotency: Uses ALTER TABLE ... ENABLE ROW LEVEL SECURITY & DROP POLICY IF EXISTS.
-- ==============================================================================

-- 1. Enable RLS on Every Table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. PROFILES & ROLES POLICIES (Anti-Privilege Escalation)
-- ==============================================================================

-- Profiles: Users can view their own profile; staff can view all profiles
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_own_or_staff"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User Roles: Users can only see their own role. Only super_admin can modify roles.
-- Standard customers or managers cannot elevate permissions!
DROP POLICY IF EXISTS "user_roles_select_own_or_staff" ON public.user_roles;
CREATE POLICY "user_roles_select_own_or_staff"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage"
  ON public.user_roles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ==============================================================================
-- 3. CATALOG POLICIES (Categories, Products, Variants, Images)
-- ==============================================================================

-- Categories: Public can view active categories; managers/super_admins can manage all
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "categories_admin_manage" ON public.categories;
CREATE POLICY "categories_admin_manage"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Products: Public can view active products; staff can view all; managers can manage
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_staff());

DROP POLICY IF EXISTS "products_admin_manage" ON public.products;
CREATE POLICY "products_admin_manage"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Variants: Inherits product visibility; managers can manage
DROP POLICY IF EXISTS "variants_select_public" ON public.product_variants;
CREATE POLICY "variants_select_public"
  ON public.product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND (p.is_active = true OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "variants_admin_manage" ON public.product_variants;
CREATE POLICY "variants_admin_manage"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Product Images: Public can view images of active products; managers can manage
DROP POLICY IF EXISTS "product_images_select_public" ON public.product_images;
CREATE POLICY "product_images_select_public"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND (p.is_active = true OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "product_images_admin_manage" ON public.product_images;
CREATE POLICY "product_images_admin_manage"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 4. CUSTOMER ADDRESSES & CARTS POLICIES
-- ==============================================================================

-- Addresses: Customers manage their own addresses; staff can read for fulfillment
DROP POLICY IF EXISTS "addresses_owner_manage" ON public.customer_addresses;
CREATE POLICY "addresses_owner_manage"
  ON public.customer_addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "addresses_staff_select" ON public.customer_addresses;
CREATE POLICY "addresses_staff_select"
  ON public.customer_addresses FOR SELECT
  USING (public.is_staff());

-- Carts: Customers manage their own cart; guest sessions handled client-side/session
DROP POLICY IF EXISTS "carts_owner_manage" ON public.carts;
CREATE POLICY "carts_owner_manage"
  ON public.carts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_items_owner_manage" ON public.cart_items;
CREATE POLICY "cart_items_owner_manage"
  ON public.cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_items.cart_id
        AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_items.cart_id
        AND c.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 5. ORDERS & COMMERCE POLICIES (Strict Security Definer RPC Model)
-- ==============================================================================

-- Orders Table:
-- Direct INSERT from client is BLOCKED for all users (guests and authenticated customers alike).
-- Orders MUST be created via the place_order() RPC to guarantee server price calculations!
-- Authenticated customers can view their own orders. Staff can view/update all orders.
DROP POLICY IF EXISTS "orders_select_own_or_staff" ON public.orders;
CREATE POLICY "orders_select_own_or_staff"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "orders_staff_update" ON public.orders;
CREATE POLICY "orders_staff_update"
  ON public.orders FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Order Line Items: Viewable by order owner or staff
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_staff())
    )
  );

-- Payments: Viewable by order owner or staff; staff can update status
DROP POLICY IF EXISTS "payments_select" ON public.payments;
CREATE POLICY "payments_select"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id
        AND (o.user_id = auth.uid() OR public.is_staff())
    )
  );

DROP POLICY IF EXISTS "payments_staff_update" ON public.payments;
CREATE POLICY "payments_staff_update"
  ON public.payments FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Payment Proofs:
-- Staff can view and verify all proofs. Customers can view proof for their own order.
DROP POLICY IF EXISTS "payment_proofs_select" ON public.payment_proofs;
CREATE POLICY "payment_proofs_select"
  ON public.payment_proofs FOR SELECT
  USING (
    public.is_staff() OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payment_proofs.order_id
        AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "payment_proofs_staff_update" ON public.payment_proofs;
CREATE POLICY "payment_proofs_staff_update"
  ON public.payment_proofs FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Shipments: Viewable by order owner or staff; staff can update tracking / status
DROP POLICY IF EXISTS "shipments_select" ON public.shipments;
CREATE POLICY "shipments_select"
  ON public.shipments FOR SELECT
  USING (
    public.is_staff() OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = shipments.order_id
        AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "shipments_staff_manage" ON public.shipments;
CREATE POLICY "shipments_staff_manage"
  ON public.shipments FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Order Status History (Timeline): Viewable by customer or staff
DROP POLICY IF EXISTS "order_timeline_select" ON public.order_status_history;
CREATE POLICY "order_timeline_select"
  ON public.order_status_history FOR SELECT
  USING (
    public.is_staff() OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_status_history.order_id
        AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "order_timeline_staff_insert" ON public.order_status_history;
CREATE POLICY "order_timeline_staff_insert"
  ON public.order_status_history FOR INSERT
  WITH CHECK (public.is_staff());

-- ==============================================================================
-- 6. MARKETING & CONTENT POLICIES (Coupons, Reviews, Banners, Settings)
-- ==============================================================================

-- Coupons: Public can view active coupons; managers can manage
DROP POLICY IF EXISTS "coupons_select_active_or_staff" ON public.coupons;
CREATE POLICY "coupons_select_active_or_staff"
  ON public.coupons FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "coupons_admin_manage" ON public.coupons;
CREATE POLICY "coupons_admin_manage"
  ON public.coupons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Coupon Usages: Staff can view; customers can view their own
DROP POLICY IF EXISTS "coupon_usages_select" ON public.coupon_usages;
CREATE POLICY "coupon_usages_select"
  ON public.coupon_usages FOR SELECT
  USING (auth.uid() = user_id OR public.is_staff());

-- Reviews:
-- Public can see approved reviews; staff can see all reviews (pending, rejected).
-- Registered customers can insert pending reviews (or use submit_review() RPC).
-- Staff can update (moderate) or delete reviews.
DROP POLICY IF EXISTS "reviews_select_approved_or_staff" ON public.reviews;
CREATE POLICY "reviews_select_approved_or_staff"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR public.is_staff() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_insert_authenticated" ON public.reviews;
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');

DROP POLICY IF EXISTS "reviews_staff_moderate" ON public.reviews;
CREATE POLICY "reviews_staff_moderate"
  ON public.reviews FOR UPDATE
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "reviews_staff_delete" ON public.reviews;
CREATE POLICY "reviews_staff_delete"
  ON public.reviews FOR DELETE
  USING (public.is_admin());

-- Banners: Public can view active banners; managers can manage
DROP POLICY IF EXISTS "banners_select_public" ON public.banners;
CREATE POLICY "banners_select_public"
  ON public.banners FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "banners_admin_manage" ON public.banners;
CREATE POLICY "banners_admin_manage"
  ON public.banners FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Site Settings: Public can read rates & accounts; only super_admin can update
DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings_admin_update" ON public.site_settings;
CREATE POLICY "site_settings_admin_update"
  ON public.site_settings FOR UPDATE
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ==============================================================================
-- 7. INVENTORY LEDGER & AUDIT LOGS POLICIES
-- ==============================================================================

-- Stock Movements: Staff can read ledger; updates handled via triggers / RPCs / Admin
DROP POLICY IF EXISTS "stock_movements_staff_select" ON public.stock_movements;
CREATE POLICY "stock_movements_staff_select"
  ON public.stock_movements FOR SELECT
  USING (public.is_staff());

DROP POLICY IF EXISTS "stock_movements_admin_insert" ON public.stock_movements;
CREATE POLICY "stock_movements_admin_insert"
  ON public.stock_movements FOR INSERT
  WITH CHECK (public.is_admin());

-- Audit Logs: Super admin and managers can view audit trails
DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_select"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());
