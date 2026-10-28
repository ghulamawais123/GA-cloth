# GA Cloth - Supabase SQL Migrations & Database Architecture

Production-grade, fully idempotent PostgreSQL migration suite for the **GA Cloth** luxury Pakistani fashion e-commerce platform.

---

## 1. Execution Order & Script Catalog

Run the scripts in the Supabase SQL Editor in the exact numeric sequence shown below:

| # | File Name | Purpose & Target Tables | Key Objects / Features |
|---|---|---|---|
| **01** | `01_extensions_enums.sql` | PostgreSQL extensions & Domain Enums | `uuid-ossp`, `pgcrypto`, `app_role`, `order_status`, `payment_method`, `payment_status`, `shipment_status`, `coupon_type`, `review_status`, `piece_count_type` |
| **02** | `02_profiles_roles.sql` | Customer profiles, RBAC, and Auth hook | `profiles`, `user_roles`, `has_role()`, `is_staff()`, `is_admin()`, `is_super_admin()`, `get_my_role()`, `handle_new_user()` trigger |
| **03** | `03_catalog.sql` | Physical apparel catalog schema | `categories`, `products`, `product_variants`, `product_images`, Btree & GIN full-text search indexes |
| **04** | `04_commerce.sql` | Ordering, payments, shipping, and carts | `customer_addresses`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `payment_proofs`, `shipments`, `order_status_history` |
| **05** | `05_marketing.sql` | Promotions, reviews, and site settings | `coupons`, `coupon_usages`, `reviews`, `banners`, `site_settings` (singleton row with PKR shipping thresholds & Pakistani bank accounts) |
| **06** | `06_inventory_audit.sql` | Stock ledger and audit trails | `stock_movements` (variant-level physical ledger), `audit_logs` |
| **07** | `07_functions_triggers.sql` | Triggers, inventory automation, and secure RPCs | `set_updated_at()`, `sync_product_total_stock()`, `generate_order_id()`, `validate_coupon()`, `place_order()` (server-authoritative pricing), `track_order()` (guest safe lookup), `submit_review()` |
| **08** | `08_rls_policies.sql` | Row Level Security (RLS) policies | Comprehensive granular access control, anti-tampering, and privilege escalation prevention across all 22 tables |
| **09** | `09_storage.sql` | Storage buckets & media policies | Buckets: `product-images`, `banners`, `site-assets` (public read, staff write); `payment-proofs` (strictly private, max 5MB, images only, staff read) |
| **10** | `10_seed_data.sql` | Initial catalog & storefront dataset | 4 categories, exactly 20 luxury products, variants, images, 3 active coupons, 2 banners, site settings, and approved reviews matching frontend `initialData.ts` |
| **11** | `11_make_admin.sql` | Admin elevation utility template | Script to elevate any registered user email to `super_admin` |

---

## 2. Core Architectural Guarantees

### A. Strictly Physical Fashion Apparel
- **Zero Digital Downloads**: No digital download links, download tokens, or digital asset tables exist.
- **Physical Attributes**: Full schema support for fabric types (`Lawn`, `Chiffon`, `Cotton`, `Jacquard`, `Silk`, `Velvet`), piece counts (`1-Piece`, `2-Piece`, `3-Piece`), brand lines, Urdu/English wash care guidelines, and variant SKUs.
- **Pakistani Logistics**: TCS Express courier consignment tracking built directly into the schema.

### B. Server-Authoritative Pricing (`place_order` RPC)
- **Zero Client Trust**: The frontend shopping cart can never dictate unit prices, subtotal, discount, or shipping fees.
- **Atomic Execution**: `place_order()` validates physical inventory stock, looks up canonical prices from `product_variants` and `products`, validates coupons, applies server shipping policy (free over PKR 3,500), deducts stock, records `stock_movements`, logs timeline events, and inserts line items in an atomic transaction.

### C. Bilingual Native Support (English & Urdu)
- All public-facing catalog items, categories, banners, wash-care instructions, order timeline notes, and coupon descriptions support dual `_en` and `_ur` text fields.

### D. Multi-Role RBAC & Anti-Privilege Escalation
- Roles: `super_admin`, `manager`, `support_staff`, `customer`.
- `user_roles` is separated from `profiles` and cannot be modified by regular users.
- Support staff can manage fulfillment and moderate reviews.
- Managers can update catalog products and inventory.
- Only `super_admin` can manage staff roles and global site settings.

---

## 3. Post-Migration Verification Queries

Run these queries in the Supabase SQL Editor after running files `01` through `10` to confirm a 100% healthy installation:

### Verification 1: Verify Table Counts & Schema Creation
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected: 22 public tables
```

### Verification 2: Verify Initial Seed Catalog Counts
```sql
SELECT
  (SELECT count(*) FROM public.categories) AS total_categories,
  (SELECT count(*) FROM public.products) AS total_products,
  (SELECT count(*) FROM public.product_variants) AS total_variants,
  (SELECT count(*) FROM public.coupons) AS total_coupons,
  (SELECT count(*) FROM public.banners) AS total_banners,
  (SELECT count(*) FROM public.site_settings) AS total_settings;
-- Expected:
-- total_categories: 4
-- total_products: 20
-- total_variants: 52
-- total_coupons: 3
-- total_banners: 2
-- total_settings: 1
```

### Verification 3: Verify RLS is Enabled on All Public Tables
```sql
SELECT
  relname AS table_name,
  relrowsecurity AS rls_enabled
FROM pg_class
JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
WHERE pg_namespace.nspname = 'public'
  AND pg_class.relkind = 'r'
ORDER BY relname;
-- Expected: All rows show rls_enabled = true
```

### Verification 4: Test Coupon Validation RPC
```sql
SELECT public.validate_coupon('AZADI15', 5000);
-- Expected output:
-- {"code": "AZADI15", "valid": true, "discount_type": "percent", "discount_amount": 750, ...}
```

### Verification 5: Test Guest Order Placement via RPC
```sql
SELECT public.place_order('{
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "03001234567",
  "shippingProvince": "Punjab",
  "shippingCity": "Lahore",
  "shippingAddress": "Gulberg III, Lahore",
  "paymentMethod": "cod",
  "appliedCoupon": "AZADI15",
  "items": [
    {
      "variantId": "v-1-0-0",
      "quantity": 1
    }
  ]
}'::jsonb);
-- Expected: Successfully returns order summary JSON with GAC-XXXXX orderId, TCS tracking, server-calculated totals, and stock deducted.
```

### Verification 6: Test Order Tracking RPC
```sql
-- Replace 'GAC-XXXXX' with the order ID returned above
SELECT public.track_order('GAC-89241', '03014589211');
-- Expected: Returns order progression, TCS consignment details, and timeline history.
```

### Verification 7: Storage Buckets Health Check
```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
ORDER BY id;
-- Expected:
-- banners (public: true)
-- payment-proofs (public: false)
-- product-images (public: true)
-- site-assets (public: true)
```

---

## 4. Admin Account Setup

Once your database migrations are complete:
1. Sign up a user account via your application or Supabase Auth dashboard.
2. Open `/supabase/sql/11_make_admin.sql`.
3. Put your registered email in `target_email := 'your_email_here@example.com';`.
4. Run the script in the Supabase SQL editor.
5. You are now designated as `super_admin`.
