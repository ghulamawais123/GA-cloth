# PRD: GA Cloth (E-commerce Website)

**Version:** 1.0 (Draft for approval)
**Date:** 2026-10-22
**Workflow:** Website Builder Master Prompt v3

---

## 1. Project Overview

**GA Cloth** ek Pakistan-focused e-commerce store hai jo physical products (kapray) aur digital products (downloadable files) bechta hai. Customers guest ki tarah order kar sakte hain ya optional account bana sakte hain. Store bara hai, is liye multi-role admin panel, variants, stock tracking aur coupons shamil hain.

**Goals**
- Daraz jaisi familiar shopping experience, lekin zyada saaf, premium aur fashion-focused look.
- Pakistan ke mutabiq payments (COD, bank/JazzCash/Easypaisa, card) aur TCS shipping.
- English + Urdu (RTL support) dono languages.
- Mobile-first, kyunki Pakistan mein zyada traffic mobile se aati hai.

**Out of scope (abhi ke liye)**
- International shipping aur multi-currency (sirf PKR).
- Multi-vendor marketplace.
- Wishlist, loyalty points (zaroorat par baad mein).

---

## 2. Tech Stack (Master Prompt ke mutabiq)

| Layer | Tool |
|---|---|
| Builder | Google AI Studio |
| Frontend | React + TypeScript |
| Backend / DB / Auth / Storage | Supabase |
| Source control | GitHub |
| Deployment | Cloudflare (primary), Vercel (fallback) |
| AI services | Cloudflare AI Gateway |
| DB setup | Supabase SQL Editor |

---

## 3. User Roles

| Role | Access |
|---|---|
| Guest | Browse, search, filter, cart, guest checkout, order tracking (order number + phone) |
| Customer | Guest ke sab kaam + account, order history, saved addresses, reviews, digital downloads |
| Support Staff | Orders dekhna/update karna, reviews moderate karna, customers dekhna |
| Manager | Support Staff + products, categories, inventory, coupons, banners, reports |
| Super Admin | Manager + staff accounts/roles, store settings, shipping & payment settings |

---

## 4. Customer-Facing Features

### 4.1 Pages
1. Home (hero banners, categories, flash/featured products, new arrivals, trust badges)
2. Category / Product Listing (search, filters, sorting, pagination)
3. Product Detail (gallery, variants, stock status, reviews, related products)
4. Cart
5. Checkout (guest ya logged-in)
6. Order Confirmation
7. Track Order
8. Login / Signup / Forgot Password
9. My Account (profile, addresses, orders, digital downloads)
10. Static pages: About, Contact, Shipping & Returns, Privacy, Terms, FAQ
11. 404 page

### 4.2 Search & Filters (confirmed)
- Search bar with suggestions (product name, category).
- Filters: category, price range, size, color, product type (physical/digital), availability (in stock), rating.
- Sorting: newest, price low-high, price high-low, popularity.

### 4.3 Product Variants & Stock (confirmed)
- Variants: size, color (har variant ka apna SKU, price override, stock).
- Stock tracking: "In stock", "Only X left", "Out of stock"; out-of-stock variant order nahi ho sakta.

### 4.4 Cart & Checkout
- Cart persistent (guest ke liye browser, logged-in ke liye database).
- Coupon code apply karna.
- Checkout fields: name, phone, email, city, address, notes.
- Shipping charges city/flat rule ke mutabiq (admin se set).
- Order sirf digital ho to address skip.

### 4.5 Payments (confirmed)
1. **Cash on Delivery** (sirf physical orders).
2. **Bank transfer / JazzCash / Easypaisa:** customer account details dekhta hai, payment karke reference number + screenshot upload karta hai; admin manually verify karta hai.
3. **Online card payment:** Pakistan-supported gateway (final gateway Phase 6 se pehle tay hoga, e.g. PayFast ya Stripe-compatible option). Card details kabhi apne server par store nahi hongi.

### 4.6 Digital Products (confirmed)
- Payment confirm hone ke baad secure, time-limited download link (Supabase Storage signed URL).
- Download limit (e.g. 5 downloads) aur expiry admin set kar sakta hai.
- Guest ko link email par bheja jata hai; customer ko account mein bhi milta hai.

### 4.7 Shipping: TCS (confirmed)
- Admin order par TCS tracking number add karta hai.
- Customer "Track Order" page par status aur TCS tracking link dekhta hai.
- Phase 1 mein manual tracking number entry. Direct TCS API integration optional baad ka phase hai (TCS account/API access par depend).

### 4.8 Reviews & Order Tracking
- Sirf verified buyers review de sakte hain (rating + text); admin approve karta hai. (Assumption: admin review management ke tehat shamil)
- Order status timeline: Placed, Confirmed, Packed, Shipped, Delivered, Cancelled.

### 4.9 Bilingual (English + Urdu)
- Language switcher; Urdu mein RTL layout aur Urdu font (e.g. Noto Nastaliq Urdu / Noto Naskh Arabic).
- Product name/description ke dono language fields admin se enter honge (Urdu optional, na ho to English dikhe).
- UI text translation files (i18n) mein.

---

## 5. Admin Panel (confirmed: sab kuch)

| Module | Functions |
|---|---|
| Dashboard | Aaj ki sales, pending orders, low stock alerts, top products, recent orders |
| Products | Create/edit/delete, images, variants, SKU, price, sale price, stock, type (physical/digital), digital file upload, EN/UR fields, SEO fields |
| Categories | Nested categories, images, EN/UR names |
| Inventory | Stock overview, low-stock threshold, stock adjustment log |
| Orders | List/filter/search, status update, TCS tracking number, payment verification, invoice print, cancel/refund notes |
| Customers | List, order history, block/unblock |
| Coupons | Percentage/fixed, min order, expiry, usage limit |
| Reviews | Approve/reject/delete |
| Banners / Content | Home banners, announcement bar, static pages |
| Shipping & Payment Settings | City/flat rates, free-shipping threshold, bank/JazzCash/Easypaisa details, COD on/off |
| Reports | Sales by date, product, category; export CSV |
| Staff & Roles | Staff create/disable, role assign (Super Admin only) |
| AI Tools | Product description generator (dekhein Section 6) |

---

## 6. AI Features (Cloudflare AI Gateway)

Aap ne "AI chahiye" kaha, magar type nahi batayi. Neeche recommended set hai (confirm karna hoga):

1. **Shopping assistant chatbot:** customer sawal poochta hai ("shadi ke liye suit dikhao"), bot products suggest karta hai, size/shipping/return FAQ ka jawab deta hai.
2. **Admin product description generator:** title/keywords se EN + Urdu description aur SEO text.
3. **Smart search suggestions** (optional, chatbot ke sath).

**Security rule:** API keys frontend mein nahi. Cloudflare Functions/Workers ke through call, keys Cloudflare secrets mein. Rate limiting aur abuse protection lazmi.

---

## 7. Design Direction

- **Inspiration:** Daraz ki familiar layout (top search bar, category menu, product grids, flash-sale strips), lekin zyada saaf aur premium.
- **Mera suggestion (alag/unique look):**
  - Warm, fabric-inspired palette: deep indigo/charcoal primary, warm sand/cream background, accent terracotta ya gold.
  - Bari lifestyle photography, zyada white space, rounded cards, subtle hover zoom on products.
  - Sticky mobile bottom bar (Home, Categories, Cart, Account).
  - Fabric/texture ya pattern detail headings aur banners mein.
- Typography: modern sans (e.g. Inter/Poppins) + Urdu ke liye Noto Nastaliq/Naskh.
- Accessibility: contrast, alt text, keyboard navigation.
- Responsive: mobile, tablet, desktop.

---

## 8. Data Model (high level, final SQL Stage C mein)

`profiles`, `user_roles`, `categories`, `products`, `product_variants`, `product_images`, `digital_files`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `payment_proofs`, `shipments`, `coupons`, `coupon_usages`, `reviews`, `addresses`, `banners`, `site_settings`, `stock_movements`, `download_links`, `audit_logs`.

Storage buckets: `product-images` (public), `payment-proofs` (private), `digital-files` (private), `banners` (public).

---

## 9. Security & Quality Requirements

- Supabase RLS har table par; customer sirf apna data dekhe.
- Role checks server-side (RLS/functions), sirf UI hide karna kafi nahi.
- Admin routes protected; staff permissions role ke mutabiq.
- Input validation (frontend + database constraints).
- Private storage + signed URLs payment proofs aur digital files ke liye.
- Audit log admin actions ka.
- No secret keys in frontend.
- Performance: image lazy loading, pagination, optimized images.
- SEO: meta tags, clean URLs, sitemap.

---

## 10. Development Phases (Stage A: Frontend, mock data)

| Phase | Scope |
|---|---|
| 1 | Project setup, design system, layout (header, footer, mobile nav), routing, i18n (EN/UR + RTL) |
| 2 | Home page, category listing, search & filters |
| 3 | Product detail (variants, stock, reviews UI), cart |
| 4 | Checkout (3 payment methods UI, shipping, coupon), order confirmation, track order |
| 5 | Customer account (auth screens, orders, addresses, downloads) |
| 6 | Admin panel part 1: layout, dashboard, products, categories, inventory |
| 7 | Admin panel part 2: orders, customers, coupons, reviews, banners, settings, reports, staff roles |
| 8 | AI UI (chatbot widget, description generator UI), polish, accessibility, final frontend QA |

Is ke baad: **Stage B** (images list) → **Stage C** (Supabase) → **Stage D** (AI Gateway) → **Stage E** (GitHub + Cloudflare deploy).

Har phase ke end par: Change Report, Test Report, Implemented Features, Files Summary, Database Changes, Known Issues, Config Changes.

---

## 11. Deployment Notes (Cloudflare)

- `bun.lock`/`bun.lockb` ho to delete, sirf `package-lock.json`.
- Root mein `.npmrc`: `legacy-peer-deps=true`
- SPA fallback (`_redirects`) refresh par 404 se bachne ke liye.
- Build: `npm run build`, output: `dist` (Vite).
- Env vars: Supabase URL/Key, AI Gateway related variables (server-side secrets alag).

---

## 12. Assumptions (Please Confirm)

1. AI features: chatbot + description generator (+ smart search).
2. Card payment gateway: Pakistan-supported gateway, final selection Phase 4 se pehle.
3. TCS: Phase 1 manual tracking number; API integration optional.
4. Wishlist abhi shamil nahi; reviews (verified buyers) aur order tracking shamil hain.
5. Digital products ka type (patterns, style guides, e-books wagera) aap bataenge; system generic file delivery support karta hai.
6. Notifications: order confirmation email (Supabase/Cloudflare email service). SMS/WhatsApp abhi out of scope.
7. Brand logo/colors aap ke paas hain to Stage B mein dein, warna suggested palette use hogi.

---

## 13. Approval Checklist

- [ ] Features list theek hai
- [ ] Assumptions confirm
- [ ] Design direction pasand
- [ ] Phase plan approve

**Approval ke baad:** main Phase 1 ka detailed Google AI Studio prompt dunga.
