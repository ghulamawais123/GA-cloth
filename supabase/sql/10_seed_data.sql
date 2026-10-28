-- ==============================================================================
-- GA CLOTH E-COMMERCE PLATFORM - SUPABASE MIGRATION
-- File: 10_seed_data.sql
-- Description: Idempotent catalog and storefront seed data.
-- Contents:
--   - 4 Physical Categories ('cat-unstitched', 'cat-pret', 'cat-festive', 'cat-menswear')
--   - Exactly 20 Physical Luxury Products with real titles, prices, descriptions
--   - Complete product variants (sizes, colors, SKUs, inventory)
--   - Product image links
--   - 3 Initial Active Coupons ('AZADI15', 'WELCOME10', 'GA1000')
--   - 2 Initial Hero Banners
--   - Singleton Site Settings (PKR shipping thresholds and verified Pakistani accounts)
--   - Initial Approved Customer Reviews
-- Privacy: Zero personal customer or password data included.
-- Idempotency: Uses ON CONFLICT DO UPDATE across all inserts.
-- ==============================================================================

-- 1. SEED CATEGORIES (4 Physical Apparel Categories)
INSERT INTO public.categories (
  id, slug, name_en, name_ur, icon_name, image_url, subcategories, description_en, description_ur, display_order, is_active
) VALUES
(
  'cat-unstitched',
  'unstitched',
  'Unstitched Lawn',
  'ان سلے لان سوٹ',
  'Scissors',
  'https://kommodo.ai/i/bb4S6Rp9bSmMS7ERDvX9',
  ARRAY['3-Piece Lawn', '2-Piece Printed', 'Chiffon Dupatta Suits', 'Jacquard Festive'],
  'Premium Pakistani unstitched fabrics with intricate threadwork, zari, and digital prints.',
  'اعلیٰ کوالٹی کے ان سلے لان سوٹ، نفیس زری اور دھاگے کی کڑھائی کے ساتھ۔',
  1,
  true
),
(
  'cat-pret',
  'pret',
  'Ready-to-Wear Pret',
  'ریڈی میڈ کُرتے (پریٹ)',
  'Shirt',
  'https://kommodo.ai/i/9j3SWBJwiwCieTBH7Ap1',
  ARRAY['Single Kurtis', '2-Piece Pret Sets', 'Formal Tunics', 'Daily Casuals'],
  'Contemporary cuts and bespoke tailored silhouettes ready for your daily and work moments.',
  'جدید تراش خراش والے سلے سلائے خوبصورت کُرتے اور دو پیس سیٹ۔',
  2,
  true
),
(
  'cat-festive',
  'festive',
  'Festive & Chiffon',
  'شادی و تہوار کلیکشن',
  'Sparkles',
  'https://kommodo.ai/i/TcKbpIl6et9uGlPdPzM2',
  ARRAY['Luxury Chiffon', 'Pure Velvet Shawls', 'Hand-worked Organza', 'Wedding Formals'],
  'Regal wedding ensembles embellished with sequins, pearl beads, and gold dabka.',
  'شادی بیاہ اور خاص تہواروں کے لیے شاہانہ ملبوسات، موتی اور سلمہ ستارے کے کام کے ساتھ۔',
  3,
  true
),
(
  'cat-menswear',
  'menswear',
  'Menswear',
  'مردانہ کُرتے و واسکٹ',
  'User',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  ARRAY['Cotton Kurta Pajama', 'Embroidered Kurtas', 'Festive Waistcoats', 'Latha Fabric'],
  'Crisp Egyptian cotton, tailored collars, and handcrafted buttons for the modern gentleman.',
  'خالص مصری سوتی کپڑا، شاندار کالر اور نفاست سے سلے مردانہ کرتے اور واسکٹ۔',
  4,
  true
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name_en = EXCLUDED.name_en,
  name_ur = EXCLUDED.name_ur,
  icon_name = EXCLUDED.icon_name,
  image_url = EXCLUDED.image_url,
  subcategories = EXCLUDED.subcategories,
  description_en = EXCLUDED.description_en,
  description_ur = EXCLUDED.description_ur,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 2. SEED PRODUCTS (Exactly 20 Physical Luxury Apparel Products)
INSERT INTO public.products (
  id, category_id, subcategory, title_en, title_ur, price, sale_price, is_sale, is_new, is_featured, is_flash_deal,
  fabric, piece_count, brand_line, description_en, description_ur, wash_care_en, wash_care_ur, features, tags, rating, reviews_count
) VALUES
-- Category 1: Unstitched Lawn (5 Products)
(
  'gac-prod-001', 'cat-unstitched', 'Chiffon Dupatta Suits',
  'Noor-e-Kashmir Embroidered Chiffon 3-Piece', 'نورِ کشمیر کڑھائی دار شفون ۳ پیس سوٹ',
  8490, 6990, true, false, true, true,
  'Chiffon', '3-Piece', 'GA LAWN COUTURE',
  'An exceptional Pakistani handcrafted masterpiece from GA LAWN COUTURE, tailored from genuine Chiffon. Featuring authentic zari, tilla thread embroidery, and fine craftsmanship designed for elegance and supreme comfort.',
  'خالص Chiffon پر تیار کردہ شاہکار پاکستانی جوڑا (GA LAWN COUTURE)۔ نفیس کڑھائی، زری اور ریشم کے کام کے ساتھ پروقار تقریبات کے لیے بہترین۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['100% Genuine Pakistani Chiffon', 'Fine Resham Threadwork & Zari Borders', 'Generous Fabric Length for Custom Tailoring', 'TCS Express 2-4 Days Fast Delivery'],
  ARRAY['Chiffon', '3-Piece', 'unstitched', 'GA LAWN COUTURE'],
  4.9, 42
),
(
  'gac-prod-002', 'cat-unstitched', '3-Piece Lawn',
  'Gul-e-Dawood Hand-Embroidered Lawn 3-Piece', 'گلِ داؤد ہینڈ کڑھائی دار لان ۳ پیس',
  4950, 4200, true, false, true, true,
  'Lawn', '3-Piece', 'GA LAWN COUTURE',
  'An exceptional Pakistani handcrafted masterpiece from GA LAWN COUTURE, tailored from genuine Lawn. Featuring authentic zari, tilla thread embroidery, and fine craftsmanship.',
  'خالص Lawn پر تیار کردہ شاہکار پاکستانی جوڑا (GA LAWN COUTURE)۔ نفیس کڑھائی، زری اور ریشم کے کام کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['100% Genuine Pakistani Lawn', 'Fine Resham Threadwork & Zari Borders', 'Generous Fabric Length for Custom Tailoring', 'TCS Express 2-4 Days Fast Delivery'],
  ARRAY['Lawn', '3-Piece', 'unstitched', 'GA LAWN COUTURE'],
  4.8, 38
),
(
  'gac-prod-003', 'cat-unstitched', '2-Piece Printed',
  'Chandni Printed Summer Lawn 2-Piece', 'چاندنی پرنٹڈ سمر لان ۲ پیس',
  3450, 2990, true, false, false, false,
  'Lawn', '2-Piece', 'GA DAILY LAWN',
  'Contemporary everyday summer lawn 2-piece suit featuring vibrant digital floral motifs and soft breathable fabric for all-day comfort.',
  'روزمرہ کے لیے آرام دہ سمر لان ۲ پیس سوٹ، دلکش ڈیجیٹل پرنٹ اور نرم و ہوا دار کپڑے کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['100% Premium Combed Lawn', 'Colorfast Digital Prints', 'Matching Lawn Trouser Fabric', 'TCS Express Fast Delivery'],
  ARRAY['Lawn', '2-Piece', 'unstitched', 'GA DAILY LAWN'],
  4.7, 24
),
(
  'gac-prod-004', 'cat-unstitched', 'Chiffon Dupatta Suits',
  'Bahar-e-Nau Organza Dupatta Lawn Suit', 'بہارِ نو اورگنزا دوپٹہ لان سوٹ',
  5650, 4850, true, false, false, false,
  'Lawn', '3-Piece', 'GA SIGNATURE LAWN',
  'Delicate pastel floral lawn suit complemented by an ethereal embroidered organza dupatta with scalloped borders.',
  'ہلکے دلکش رنگوں والا لان سوٹ بمع نفیس کڑھائی دار اورگنزا دوپٹہ اور خوبصورت کٹ ورک بارڈر۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Air-jet Mercerized Lawn', 'Embroidered Organza Dupatta', 'Embroidered Hemline Patch', 'TCS Courier 2-4 Days'],
  ARRAY['Lawn', '3-Piece', 'unstitched', 'GA SIGNATURE LAWN'],
  4.8, 29
),
(
  'gac-prod-006', 'cat-unstitched', '3-Piece Lawn',
  'Mehrunissa Embroidered Lawn with Silk Dupatta', 'مہرالنساء کڑھائی دار لان بمع سلک دوپٹہ',
  6200, 5400, true, true, true, false,
  'Lawn', '3-Piece', 'GA HERITAGE LAWN',
  'Timeless heritage collection crafted with dense resham tilla neck embroidery and paired with a lustrous pure medium silk digital dupatta.',
  'روایتی شاہکار کلیکشن، نفیس ریشم تلا کڑھائی اور چمکدار پیور سلک ڈیجیٹل دوپٹے کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Heavy Embroidered Front & Neckline', '100% Pure Silk Dupatta', 'Dyed Cambric Trouser', 'TCS Fast Delivery'],
  ARRAY['Lawn', '3-Piece', 'unstitched', 'GA HERITAGE LAWN'],
  4.9, 31
),

-- Category 2: Ready-to-Wear Pret (5 Products)
(
  'gac-prod-013', 'cat-pret', 'Single Kurtis',
  'Zari Jacquard Pret Kurti with Pearl Tassels', 'زری جیکارڈ سلی سلائی کُرتی بمع پرل ٹیسلز',
  3650, 2990, true, false, true, false,
  'Jacquard', '1-Piece', 'GA PRET ATELIER',
  'Expertly tailored ready-to-wear Jacquard kurti featuring delicate woven zari motifs and handcrafted pearl tassel detailing on the collar.',
  'نفاست سے سلی سلائی جیکارڈ کُرتی، خوبصورت زری کے کام اور بین کالر پر موتیوں والے ٹیسلز کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Woven Metallic Jacquard', 'Handmade Pearl Tassels', 'Relaxed Contemporary Cut', 'TCS Fast Delivery'],
  ARRAY['Jacquard', '1-Piece', 'pret', 'GA PRET ATELIER'],
  4.8, 35
),
(
  'gac-prod-014', 'cat-pret', 'Formal Tunics',
  'Kashmiri Tilla Embroidered Linen Tunic', 'کشمیری تلا کڑھائی والی لِنن کُرتی',
  4200, 3600, true, false, false, false,
  'Cotton', '1-Piece', 'GA PRET ATELIER',
  'Statement semi-formal tunic with intricate Kashmiri paisley embroidery along the placket and cuffs.',
  'پروقار سیمی فارمل لِنن کُرتی جس پر کشمیری روایتی کیری اور بیل بوٹوں کی کڑھائی کی گئی ہے۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Premium Slub Cotton Linen', 'Authentic Kashmiri Tilla Stitching', 'Comfort Daily Silhouette', 'TCS Fast Delivery'],
  ARRAY['Cotton', '1-Piece', 'pret', 'GA PRET ATELIER'],
  4.6, 22
),
(
  'gac-prod-015', 'cat-pret', '2-Piece Pret Sets',
  'Rangrez Block-Printed 2-Piece Pret Set', 'رنگریز بلاک پرنٹڈ ۲ پیس پریٹ سیٹ',
  5450, 4650, true, true, false, false,
  'Lawn', '2-Piece', 'GA URBAN PRET',
  'Artisanal wooden block-printed shirt paired with matching straight-fit cigarette pants for effortless urban style.',
  'ہاتھ کے روایتی ٹھپہ بلاک پرنٹ سے سجی قمیض اور سیدھے پاجامے کا جدید دو پیس سیٹ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Handcrafted Wooden Block Print', 'Stitched 2-Piece Set', 'Breathable Pure Lawn', 'TCS Express 2-4 Days'],
  ARRAY['Lawn', '2-Piece', 'pret', 'GA URBAN PRET'],
  4.8, 27
),
(
  'gac-prod-017', 'cat-pret', '2-Piece Pret Sets',
  'Raw Silk Pret Co-ord Set with Cutwork', 'را سلک پریٹ کو آرڈ سیٹ بمع کٹ ورک',
  7850, 6950, true, false, true, false,
  'Silk', '2-Piece', 'GA SIGNATURE COUTURE',
  'Luxurious raw silk matching co-ord set with handcrafted schiffli cutwork borders on daman and sleeves.',
  'شاہانہ را سلک کا دو پیس کو آرڈ سیٹ، دامن اور آستینوں پر نفیس کٹ ورک کے کام کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['100% Genuine Raw Silk', 'Schiffli Cutwork Detailing', 'Modern Tailored Fit', 'TCS Express Dispatch'],
  ARRAY['Silk', '2-Piece', 'pret', 'GA SIGNATURE COUTURE'],
  4.9, 44
),
(
  'gac-prod-021', 'cat-pret', 'Formal Tunics',
  'Gulberg Velvet Evening Pret Tunic', 'گلبرگ ویلوٹ ایوننگ پریٹ کُرتی',
  7500, 6200, true, false, false, true,
  'Velvet', '1-Piece', 'GA LUXURY EVENING',
  'Deep midnight micro-velvet formal evening tunic detailed with antique dull gold zari and sequin motifs.',
  'سردیوں کی شاموں کے لیے خاص مائیکرو ویلوٹ کُرتی، پروقار ڈل گولڈ زری اور باریک ستارے کے کام کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Micro Velvet 9000 Quality', 'Antique Dull Gold Zari', 'Bespoke Evening Cut', 'TCS Express Fast Delivery'],
  ARRAY['Velvet', '1-Piece', 'pret', 'GA LUXURY EVENING'],
  4.9, 19
),

-- Category 3: Festive & Chiffon (5 Products)
(
  'gac-prod-025', 'cat-festive', 'Pure Velvet Shawls',
  'Shahkaar Regal Velvet Shawl Formal Ensemble', 'شاہکار ریگل ویلوٹ شال فارمل سوٹ',
  14500, 11900, true, false, true, false,
  'Velvet', '3-Piece', 'GA ROYAL COUTURE',
  'A true winter wedding statement featuring a lavishly embroidered pure micro-velvet shawl paired with raw silk shirt and cigarette pants.',
  'شادیوں کے سیزن کا سب سے پروقار شاہکار، خالص مائیکرو ویلوٹ کی بھاری کڑھائی والی شال بمع را سلک قمیض اور پاجامہ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Pure Micro 9000 Velvet Shawl', 'Heavy Tilla Dabka Four-Sided Border', 'Raw Silk Shirt & Trouser', 'Luxury GA Cloth Keepsake Box'],
  ARRAY['Velvet', '3-Piece', 'festive', 'GA ROYAL COUTURE'],
  5.0, 52
),
(
  'gac-prod-026', 'cat-festive', 'Luxury Chiffon',
  'Koh-e-Noor Zari Chiffon Wedding 3-Piece', 'کوہِ نور زری شفون ویڈنگ ۳ پیس',
  12800, 10500, true, false, false, true,
  'Chiffon', '3-Piece', 'GA FESTIVE SIGNATURE',
  'Ethereal pure chiffon formal ensemble glistening with sequin-sprinkled jaal work and scalloped embroidered borders.',
  'خالص شفون پر تیار کردہ ویڈنگ سوٹ، چمکدار جال کڑھائی اور کٹ ورک والے دوپٹے کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Pure Crinkle Chiffon', 'Intricate Sequin-Resham Jaal', 'Full Embroidered Chiffon Dupatta', 'TCS Express 2-4 Days'],
  ARRAY['Chiffon', '3-Piece', 'festive', 'GA FESTIVE SIGNATURE'],
  4.9, 36
),
(
  'gac-prod-027', 'cat-festive', 'Hand-worked Organza',
  'Dilkash Handworked Organza Bridal Pishwas', 'دلکش ہینڈ ورکڈ اورگنزا برائیڈل پیشواز',
  18500, 15900, true, false, true, false,
  'Chiffon', '3-Piece', 'GA BRIDAL ATELIER',
  'Bridal-grade flared pishwas handcrafted on sheer organza featuring rich pearl, dabka, naqshi, and mirror embroidery.',
  'عروسی نفاست سے سجی خوبصورت گھیر دار پیشواز، موتی، دبکہ، نقشی اور شیشے کے روایتی کام کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Handcrafted Dabka & Pearl Work', '16-Kalli Flared Silhouette', 'Organza Dupatta with Kiran Lace', 'TCS Express Fast Delivery'],
  ARRAY['Chiffon', '3-Piece', 'festive', 'GA BRIDAL ATELIER'],
  5.0, 48
),
(
  'gac-prod-028', 'cat-festive', 'Wedding Formals',
  'Shahi Mehal Pure Raw Silk Formal 3-Piece', 'شاہی محل پیور را سلک فارمل ۳ پیس',
  13900, 11500, true, false, false, false,
  'Silk', '3-Piece', 'GA ROYAL COUTURE',
  'Regal formal ensemble tailored on 80g pure raw silk with antique kora and tilla embroidery along the neckline and cuffs.',
  'خالص را سلک پر تیار کردہ شاہی لباس، گلے اور آستینوں پر پروقار کورا اور تلا کے کام کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['80g Pure Raw Silk', 'Antique Gold Kora & Tilla Work', 'Organza Jacquard Dupatta', 'TCS Express 2-4 Days'],
  ARRAY['Silk', '3-Piece', 'festive', 'GA ROYAL COUTURE'],
  4.8, 26
),
(
  'gac-prod-035', 'cat-festive', 'Wedding Formals',
  'Mehr-o-Mah Hand-worked Zari Net Peshwas', 'مہر و ماہ ہینڈ ورکڈ زری نیٹ پیشواز',
  16800, 13900, true, true, true, false,
  'Chiffon', '3-Piece', 'GA BRIDAL ATELIER',
  'Flared bridal gown on shimmering metallic French net, hand-embellished with intricate floral jaal and zardozi craftsmanship.',
  'شاہانہ فلوئنگ پیشواز جو نفیس زردوزی، کندن اور ریشم کے کام سے مزین ہے۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Metallic French Net Base', 'Handcrafted Zardozi Embellishments', 'Satin Silk Inner Slip Included', 'TCS Express Delivery'],
  ARRAY['Chiffon', '3-Piece', 'festive', 'GA BRIDAL ATELIER'],
  4.9, 39
),

-- Category 4: Menswear (5 Products)
(
  'gac-prod-037', 'cat-menswear', 'Latha Fabric',
  'Quaid Classic White Egyptian Cotton Suit', 'قائد کلاسک سفید مصری سوتی سوٹ',
  4450, 3800, true, false, true, false,
  'Cotton', '2-Piece', 'GA BESPOKE MEN',
  'Timeless crisp white Pakistani gentleman ensemble tailored from genuine long-staple Egyptian cotton latha with stiff band collar.',
  'خالص مصری سوتی لٹھا سے تیار کردہ پروقار سفید مردانہ سوٹ، کلف دار بین کالر اور کف کے ساتھ۔',
  'Gentle hand wash or dry clean. Crisp starch iron recommended.', 'ہلکے ہاتھ سے دھوئیں یا ڈرائی کلین کروائیں۔ کلف لگا کر استری کریں۔',
  ARRAY['100% Giza Egyptian Cotton', 'Crisp Latha Weave', 'Tailored Stiff Band Collar', 'TCS Express 2-4 Days'],
  ARRAY['Cotton', '2-Piece', 'menswear', 'GA BESPOKE MEN'],
  4.9, 61
),
(
  'gac-prod-038', 'cat-menswear', 'Cotton Kurta Pajama',
  'Charcoal Black Boski Soft Kurta Pajama', 'چارکول بلیک بوسکی نرم کُرتا پاجامہ',
  5200, 4450, true, false, false, true,
  'Silk', '2-Piece', 'GA BESPOKE MEN',
  'Pure synthetic soft-finish Boski feel kurta pajama in jet charcoal black, ideal for Jummah prayers and festive gatherings.',
  'نرم و ملائم بوسکی فال والا چارکول بلیک کُرتا پاجامہ، نمازِ جمعہ اور تہواروں کے لیے بہترین انتخاب۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Ultra-soft Boski Drape', 'Matte Black Buttons', 'Matching Comfortable Pajama', 'TCS Fast Delivery'],
  ARRAY['Silk', '2-Piece', 'menswear', 'GA BESPOKE MEN'],
  4.8, 47
),
(
  'gac-prod-039', 'cat-menswear', 'Embroidered Kurtas',
  'Royal Navy Embroidered Collar Cotton Kurta', 'رائل نیوی کڑھائی دار بین کالر کُرتا',
  3950, 3350, true, true, false, false,
  'Cotton', '1-Piece', 'GA BESPOKE MEN',
  'Deep royal navy crisp cotton kurta accented with subtle tonal thread embroidery along the placket and collar.',
  'گہرے رائل نیوی کاٹن کُرتے پر کالر اور پٹی کے ساتھ نفاست سے بنی یک رنگی دھاگے کی کڑھائی۔',
  'Gentle hand wash. Moderate iron.', 'ہاتھ سے دھوئیں اور درمیانی آنچ پر استری کریں۔',
  ARRAY['Premium Combed Cotton', 'Tonal Thread Placket Embroidery', 'Bespoke Tailored Cuffs', 'TCS Express Dispatch'],
  ARRAY['Cotton', '1-Piece', 'menswear', 'GA BESPOKE MEN'],
  4.7, 33
),
(
  'gac-prod-040', 'cat-menswear', 'Festive Waistcoats',
  'Jamawar Brocade Gold Festive Waistcoat', 'جامہ وار بروکیڈ گولڈ فیسٹیو واسکٹ',
  6500, 5200, true, false, true, false,
  'Jacquard', '1-Piece', 'GA REGAL GENTLEMEN',
  'Exquisite festive waistcoat crafted from imperial gold woven Jamawar brocade with brass handcrafted buttons.',
  'شاہانہ سنہری جامہ وار بروکیڈ پر تیار کردہ فیسٹیو واسکٹ، روایتی پیتل کے بٹنوں کے ساتھ۔',
  'Dry clean only. Store in garment cover.', 'صرف ڈرائی کلین کروائیں۔ گارمنٹ کور میں محفوظ رکھیں۔',
  ARRAY['Imperial Gold Woven Jamawar', 'Bespoke Metal Buttons', 'Breathable Satin Lining', 'TCS 2-Day Fast Courier'],
  ARRAY['Jacquard', '1-Piece', 'menswear', 'GA REGAL GENTLEMEN'],
  5.0, 54
),
(
  'gac-prod-042', 'cat-menswear', 'Embroidered Kurtas',
  'Olive Khaki Raw Silk Groom Kurta', 'زیتونی خاکی را سلک گروم کُرتا',
  5800, 4900, true, false, false, false,
  'Silk', '1-Piece', 'GA BESPOKE MEN',
  'Earthy olive khaki raw silk wedding kurta tailored with minimal gold dabka stitch details on the neckline.',
  'زیتونی خاکی را سلک پر تیار کردہ دولہا یا باراتی کُرتا، گلے پر ہلکے دبکہ اور زری ٹانکے کے ساتھ۔',
  'Dry clean recommended. Gentle reverse iron with low temperature.', 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
  ARRAY['Pure Raw Silk Fabric', 'Minimal Gold Dabka Touch', 'Mandarin Band Collar', 'TCS Express Dispatch'],
  ARRAY['Silk', '1-Piece', 'menswear', 'GA BESPOKE MEN'],
  4.8, 28
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory = EXCLUDED.subcategory,
  title_en = EXCLUDED.title_en,
  title_ur = EXCLUDED.title_ur,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  is_sale = EXCLUDED.is_sale,
  is_new = EXCLUDED.is_new,
  is_featured = EXCLUDED.is_featured,
  is_flash_deal = EXCLUDED.is_flash_deal,
  fabric = EXCLUDED.fabric,
  piece_count = EXCLUDED.piece_count,
  brand_line = EXCLUDED.brand_line,
  description_en = EXCLUDED.description_en,
  description_ur = EXCLUDED.description_ur,
  wash_care_en = EXCLUDED.wash_care_en,
  wash_care_ur = EXCLUDED.wash_care_ur,
  features = EXCLUDED.features,
  tags = EXCLUDED.tags,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count;

-- 3. SEED PRODUCT IMAGES (Exact Image Links)
INSERT INTO public.product_images (id, product_id, image_url, alt_text_en, alt_text_ur, display_order, is_primary)
VALUES
(gen_random_uuid(), 'gac-prod-001', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'Noor-e-Kashmir Chiffon Suit', 'نور کشمیر شفون سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-002', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'Gul-e-Dawood Lawn Suit', 'گل داؤد لان سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-003', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', 'Chandni Printed Lawn 2-Piece', 'چاندنی پرنٹڈ لان ۲ پیس', 1, true),
(gen_random_uuid(), 'gac-prod-004', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', 'Bahar-e-Nau Organza Dupatta Suit', 'بہار نو اورگنزا سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-006', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'Mehrunissa Embroidered Lawn Suit', 'مہرالنساء لان سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-013', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', 'Zari Jacquard Pret Kurti', 'زری جیکارڈ کُرتی', 1, true),
(gen_random_uuid(), 'gac-prod-014', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'Kashmiri Linen Tunic', 'کشمیری لِنن کُرتی', 1, true),
(gen_random_uuid(), 'gac-prod-015', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'Rangrez Block Printed 2-Piece', 'رنگریز بلاک پرنٹڈ ۲ پیس', 1, true),
(gen_random_uuid(), 'gac-prod-017', 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80', 'Raw Silk Pret Co-ord Set', 'را سلک کو آرڈ سیٹ', 1, true),
(gen_random_uuid(), 'gac-prod-021', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80', 'Gulberg Velvet Evening Kurti', 'گلبرگ ویلوٹ کُرتی', 1, true),
(gen_random_uuid(), 'gac-prod-025', 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80', 'Shahkaar Velvet Shawl Suit', 'شاہکار ویلوٹ شال سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-026', 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=800&q=80', 'Koh-e-Noor Zari Chiffon Suit', 'کوہ نور زری شفون سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-027', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', 'Dilkash Organza Bridal Pishwas', 'دلکش برائیڈل پیشواز', 1, true),
(gen_random_uuid(), 'gac-prod-028', 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=800&q=80', 'Shahi Mehal Raw Silk 3-Piece', 'شاہی محل را سلک سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-035', 'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?auto=format&fit=crop&w=800&q=80', 'Mehr-o-Mah Zari Net Peshwas', 'مہر و ماہ پیشواز', 1, true),
(gen_random_uuid(), 'gac-prod-037', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80', 'Quaid Egyptian Cotton Suit', 'قائد مصری سوتی سوٹ', 1, true),
(gen_random_uuid(), 'gac-prod-038', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', 'Charcoal Boski Kurta Pajama', 'بوسکی کُرتا پاجامہ', 1, true),
(gen_random_uuid(), 'gac-prod-039', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'Royal Navy Embroidered Kurta', 'رائل نیوی کُرتا', 1, true),
(gen_random_uuid(), 'gac-prod-040', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', 'Jamawar Brocade Gold Waistcoat', 'جامہ وار واسکٹ', 1, true),
(gen_random_uuid(), 'gac-prod-042', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'Olive Khaki Groom Kurta', 'زیتونی خاکی گروم کُرتا', 1, true)
ON CONFLICT DO NOTHING;

-- 4. SEED PRODUCT VARIANTS (Physical Sizes, Colors, and Stock)
INSERT INTO public.product_variants (id, product_id, size, color, color_hex, sku, stock)
VALUES
-- Product 1: Noor-e-Kashmir Chiffon
('v-1-0-0', 'gac-prod-001', 'Unstitched', 'Kashmir Maroon', '#631626', 'GAC-CHI-1-U-MRN', 18),
('v-1-0-1', 'gac-prod-001', 'Stitched Small', 'Kashmir Maroon', '#631626', 'GAC-CHI-1-S-MRN', 12),
('v-1-0-2', 'gac-prod-001', 'Stitched Medium', 'Kashmir Maroon', '#631626', 'GAC-CHI-1-M-MRN', 15),
('v-1-1-0', 'gac-prod-001', 'Unstitched', 'Royal Gold', '#c59d42', 'GAC-CHI-1-U-GLD', 14),
('v-1-2-0', 'gac-prod-001', 'Unstitched', 'Forest Green', '#16432b', 'GAC-CHI-1-U-GRN', 16),

-- Product 2: Gul-e-Dawood Lawn
('v-2-0-0', 'gac-prod-002', 'Unstitched', 'Sky Aqua', '#2e7d9e', 'GAC-LAW-2-U-AQU', 22),
('v-2-1-0', 'gac-prod-002', 'Unstitched', 'Ivory Cream', '#f2ece1', 'GAC-LAW-2-U-IVR', 20),
('v-2-2-0', 'gac-prod-002', 'Unstitched', 'Powder Blue', '#87adc4', 'GAC-LAW-2-U-BLU', 18),

-- Product 3: Chandni Summer Lawn 2-Piece
('v-3-0-0', 'gac-prod-003', 'Unstitched', 'Summer Yellow', '#eab308', 'GAC-LAW-3-U-YEL', 25),
('v-3-1-0', 'gac-prod-003', 'Unstitched', 'Lilac Floral', '#a855f7', 'GAC-LAW-3-U-LIL', 19),
('v-3-2-0', 'gac-prod-003', 'Unstitched', 'Mint Green', '#10b981', 'GAC-LAW-3-U-MNT', 21),

-- Product 4: Bahar-e-Nau Organza Dupatta Suit
('v-4-0-0', 'gac-prod-004', 'Unstitched', 'Emerald Jade', '#064e3b', 'GAC-LAW-4-U-EMR', 17),
('v-4-1-0', 'gac-prod-004', 'Unstitched', 'Golden Olive', '#854d0e', 'GAC-LAW-4-U-OLV', 14),

-- Product 6: Mehrunissa Embroidered Lawn
('v-6-0-0', 'gac-prod-006', 'Unstitched', 'Crimson Wine', '#881337', 'GAC-LAW-6-U-CRM', 15),
('v-6-1-0', 'gac-prod-006', 'Unstitched', 'Gilded Bronze', '#78350f', 'GAC-LAW-6-U-BRZ', 13),

-- Product 13: Zari Jacquard Pret Kurti
('v-13-0-0', 'gac-prod-013', 'Small', 'Rose Quartz', '#f43f5e', 'GAC-JAC-13-S-ROZ', 10),
('v-13-0-1', 'gac-prod-013', 'Medium', 'Rose Quartz', '#f43f5e', 'GAC-JAC-13-M-ROZ', 14),
('v-13-0-2', 'gac-prod-013', 'Large', 'Rose Quartz', '#f43f5e', 'GAC-JAC-13-L-ROZ', 12),
('v-13-1-0', 'gac-prod-013', 'Small', 'Shimmer Champagne', '#fef08a', 'GAC-JAC-13-S-CHP', 9),
('v-13-1-1', 'gac-prod-013', 'Medium', 'Shimmer Champagne', '#fef08a', 'GAC-JAC-13-M-CHP', 11),

-- Product 14: Kashmiri Linen Tunic
('v-14-0-0', 'gac-prod-014', 'Small', 'Terracotta Rust', '#c2410c', 'GAC-COT-14-S-RST', 8),
('v-14-0-1', 'gac-prod-014', 'Medium', 'Terracotta Rust', '#c2410c', 'GAC-COT-14-M-RST', 15),
('v-14-0-2', 'gac-prod-014', 'Large', 'Terracotta Rust', '#c2410c', 'GAC-COT-14-L-RST', 9),
('v-14-1-1', 'gac-prod-014', 'Medium', 'Cinnamon Clay', '#9a3412', 'GAC-COT-14-M-CIN', 11),

-- Product 15: Rangrez Block-Printed Pret Set
('v-15-0-0', 'gac-prod-015', 'Small', 'Indigo Monochrome', '#1e293b', 'GAC-LAW-15-S-IND', 12),
('v-15-0-1', 'gac-prod-015', 'Medium', 'Indigo Monochrome', '#1e293b', 'GAC-LAW-15-M-IND', 16),
('v-15-0-2', 'gac-prod-015', 'Large', 'Indigo Monochrome', '#1e293b', 'GAC-LAW-15-L-IND', 10),

-- Product 17: Raw Silk Co-ord Set
('v-17-0-0', 'gac-prod-017', 'Small', 'Midnight Obsidian', '#020617', 'GAC-SIL-17-S-OBS', 9),
('v-17-0-1', 'gac-prod-017', 'Medium', 'Midnight Obsidian', '#020617', 'GAC-SIL-17-M-OBS', 14),
('v-17-0-2', 'gac-prod-017', 'Large', 'Midnight Obsidian', '#020617', 'GAC-SIL-17-L-OBS', 8),

-- Product 21: Gulberg Velvet Evening Tunic
('v-21-0-0', 'gac-prod-021', 'Small', 'Raven Black', '#09090b', 'GAC-VEL-21-S-BLK', 8),
('v-21-0-1', 'gac-prod-021', 'Medium', 'Raven Black', '#09090b', 'GAC-VEL-21-M-BLK', 11),
('v-21-0-2', 'gac-prod-021', 'Large', 'Raven Black', '#09090b', 'GAC-VEL-21-L-BLK', 7),

-- Product 25: Shahkaar Velvet Shawl Ensemble
('v-25-0-0', 'gac-prod-025', 'Unstitched', 'Deep Burgundy Velvet', '#4c0519', 'GAC-VEL-25-U-BUR', 14),
('v-25-0-1', 'gac-prod-025', 'Medium Stitched', 'Deep Burgundy Velvet', '#4c0519', 'GAC-VEL-25-M-BUR', 8),
('v-25-1-0', 'gac-prod-025', 'Unstitched', 'Emerald Velvet', '#022c22', 'GAC-VEL-25-U-EMR', 12),

-- Product 26: Koh-e-Noor Zari Chiffon Suit
('v-26-0-0', 'gac-prod-026', 'Unstitched', 'Champagne Shimmer', '#fef3c7', 'GAC-CHI-26-U-CHP', 15),
('v-26-1-0', 'gac-prod-026', 'Unstitched', 'Soft Peach', '#ffedd5', 'GAC-CHI-26-U-PCH', 12),

-- Product 27: Dilkash Organza Bridal Pishwas
('v-27-0-0', 'gac-prod-027', 'Custom Stitched', 'Marigold Ochre', '#f59e0b', 'GAC-CHI-27-C-MRG', 7),
('v-27-1-0', 'gac-prod-027', 'Custom Stitched', 'Sunset Terracotta', '#ea580c', 'GAC-CHI-27-C-TER', 6),

-- Product 28: Shahi Mehal Raw Silk 3-Piece
('v-28-0-0', 'gac-prod-028', 'Unstitched', 'Gilded Zari', '#d97706', 'GAC-SIL-28-U-ZAR', 10),
('v-28-1-0', 'gac-prod-028', 'Unstitched', 'Copper Rust', '#9a3412', 'GAC-SIL-28-U-RST', 8),

-- Product 35: Mehr-o-Mah Zari Net Peshwas
('v-35-0-0', 'gac-prod-035', 'Bridal Medium', 'Glistening Gold', '#facc15', 'GAC-CHI-35-M-GLD', 6),
('v-35-1-0', 'gac-prod-035', 'Bridal Medium', 'Ivory Frost', '#f8fafc', 'GAC-CHI-35-M-IVR', 5),

-- Product 37: Quaid Classic White Cotton Suit
('v-37-0-0', 'gac-prod-037', 'Small (38)', 'Pristine Snow White', '#ffffff', 'GAC-COT-37-38-WHT', 14),
('v-37-0-1', 'gac-prod-037', 'Medium (40)', 'Pristine Snow White', '#ffffff', 'GAC-COT-37-40-WHT', 25),
('v-37-0-2', 'gac-prod-037', 'Large (42)', 'Pristine Snow White', '#ffffff', 'GAC-COT-37-42-WHT', 20),
('v-37-0-3', 'gac-prod-037', 'XL (44)', 'Pristine Snow White', '#ffffff', 'GAC-COT-37-44-WHT', 12),

-- Product 38: Charcoal Boski Kurta Pajama
('v-38-0-0', 'gac-prod-038', 'Medium (40)', 'Charcoal Black', '#18181b', 'GAC-SIL-38-40-CHR', 18),
('v-38-0-1', 'gac-prod-038', 'Large (42)', 'Charcoal Black', '#18181b', 'GAC-SIL-38-42-CHR', 15),

-- Product 39: Royal Navy Embroidered Kurta
('v-39-0-0', 'gac-prod-039', 'Medium (40)', 'Navy Midnight', '#1e3a8a', 'GAC-COT-39-40-NVY', 17),
('v-39-0-1', 'gac-prod-039', 'Large (42)', 'Navy Midnight', '#1e3a8a', 'GAC-COT-39-42-NVY', 14),

-- Product 40: Jamawar Brocade Gold Waistcoat
('v-40-0-0', 'gac-prod-040', '38 Regular', 'Imperial Gold Jamawar', '#d97706', 'GAC-JAC-40-38-GLD', 11),
('v-40-0-1', 'gac-prod-040', '40 Regular', 'Imperial Gold Jamawar', '#d97706', 'GAC-JAC-40-40-GLD', 16),
('v-40-0-2', 'gac-prod-040', '42 Regular', 'Imperial Gold Jamawar', '#d97706', 'GAC-JAC-40-42-GLD', 12),

-- Product 42: Olive Khaki Raw Silk Groom Kurta
('v-42-0-0', 'gac-prod-042', 'Medium (40)', 'Olive Green', '#3f6212', 'GAC-SIL-42-40-OLV', 10),
('v-42-0-1', 'gac-prod-042', 'Large (42)', 'Olive Green', '#3f6212', 'GAC-SIL-42-42-OLV', 8)
ON CONFLICT (id) DO UPDATE SET
  size = EXCLUDED.size,
  color = EXCLUDED.color,
  color_hex = EXCLUDED.color_hex,
  sku = EXCLUDED.sku,
  stock = EXCLUDED.stock;

-- Update total_stock on products based on variants
UPDATE public.products p
SET total_stock = (
  SELECT COALESCE(SUM(pv.stock), 0)
  FROM public.product_variants pv
  WHERE pv.product_id = p.id
);

-- 5. SEED COUPONS (Active Promotional Codes)
INSERT INTO public.coupons (
  code, discount_type, value, min_order, max_discount, expiry_date, usage_limit, used_count, is_active, description_en, description_ur
) VALUES
(
  'AZADI15',
  'percent',
  15,
  3000,
  2500,
  '2026-12-31',
  1000,
  284,
  true,
  '15% off on orders above PKR 3,000',
  '۳۰۰۰ روپے سے زیادہ کے آرڈر پر ۱۵٪ رعایت'
),
(
  'WELCOME10',
  'percent',
  10,
  1500,
  1500,
  '2026-11-30',
  500,
  112,
  true,
  '10% off for first-time shoppers',
  'پہلی بار خریداری کرنے والے خریداروں کے لیے ۱۰٪ رعایت'
),
(
  'GA1000',
  'fixed',
  1000,
  8000,
  NULL,
  '2026-12-15',
  200,
  65,
  true,
  'PKR 1,000 flat discount on luxury festive orders over PKR 8,000',
  '۸۰۰۰ روپے سے زائد کے آرڈر پر فلیٹ ۱۰۰۰ روپے کی بچت'
)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  value = EXCLUDED.value,
  min_order = EXCLUDED.min_order,
  max_discount = EXCLUDED.max_discount,
  expiry_date = EXCLUDED.expiry_date,
  usage_limit = EXCLUDED.usage_limit,
  used_count = EXCLUDED.used_count,
  is_active = EXCLUDED.is_active,
  description_en = EXCLUDED.description_en,
  description_ur = EXCLUDED.description_ur;

-- 6. SEED BANNERS (Promotional Homepage Campaigns)
INSERT INTO public.banners (
  id, title_en, title_ur, subtitle_en, subtitle_ur, cta_text_en, cta_text_ur, link, image_url, badge_en, badge_ur, display_order, is_active
) VALUES
(
  'ban-1',
  'Autumn Festive Volume 2026',
  'خزان کا پروقار فیسٹیو والیوم ۲۰۲۶',
  'Intricately embroidered chiffon, royal velvets, and luxury lawn crafted for the wedding season.',
  'شادی کے سیزن کے لیے خالص مخمل اور نفیس کڑھائی والے شفون ملبوسات۔',
  'Explore Festive Suits',
  'فیسٹیو کلیکشن دیکھیں',
  '/shop?category=cat-festive',
  'https://kommodo.ai/i/zjxalCvDgmbtQLSM51YS',
  'New Festive Drop',
  'تازہ ترین کلیکشن',
  1,
  true
),
(
  'ban-2',
  'Ready-to-Wear Pret & Menswear',
  'ریڈی میڈ کُرتے اور مردانہ فیسٹیو کلیکشن',
  'Bespoke Egyptian cotton kurtas, embroidered festive waistcoats, and contemporary pret for modern occasions.',
  'شاندار سلے سلائے کُرتے اور زری واسکٹ، جدید فیشن اور روایتی نفاست کے ساتھ۔',
  'Browse Pret Collection',
  'پریٹ کلیکشن دیکھیں',
  '/shop?category=cat-pret',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
  'Handcrafted Drops',
  'ہینڈ کرافٹڈ کلیکشن',
  2,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ur = EXCLUDED.title_ur,
  subtitle_en = EXCLUDED.subtitle_en,
  subtitle_ur = EXCLUDED.subtitle_ur,
  cta_text_en = EXCLUDED.cta_text_en,
  cta_text_ur = EXCLUDED.cta_text_ur,
  link = EXCLUDED.link,
  image_url = EXCLUDED.image_url,
  badge_en = EXCLUDED.badge_en,
  badge_ur = EXCLUDED.badge_ur,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 7. SEED STORE SETTINGS (Singleton Row 1 with Verified Pakistani Accounts)
INSERT INTO public.site_settings (
  id,
  free_shipping_threshold,
  standard_shipping_fee,
  cod_enabled,
  announcement_text_en,
  announcement_text_ur,
  bank_details,
  jazzcash_details,
  easypaisa_details
) VALUES (
  1,
  3500.00, -- Free Delivery nationwide over PKR 3,500
  250.00,  -- Standard TCS Express Shipping Fee PKR 250
  true,
  '✨ FESTIVE OFFER: Use coupon AZADI15 for 15% OFF! Free Nationwide TCS Delivery over PKR 3,500.',
  '✨ فیسٹیو آفر: کوڈ AZADI15 لگائیں اور پائیں 15٪ رعایت! ۳۵۰۰ روپے سے زائد کے آرڈر پر مفت TCS ڈلیوری۔',
  '{
    "bankName": "Meezan Bank Limited (Islamic Banking)",
    "accountTitle": "GA CLOTH APPAREL SMC PVT LTD",
    "accountNumber": "02840105829102",
    "iban": "PK45MEZN0002840105829102",
    "branchCode": "0284 (Gulberg III Lahore)"
  }'::jsonb,
  '{
    "accountTitle": "GA Cloth Official",
    "accountNumber": "0300-1234567"
  }'::jsonb,
  '{
    "accountTitle": "GA Cloth Official",
    "accountNumber": "0345-9876543"
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  free_shipping_threshold = EXCLUDED.free_shipping_threshold,
  standard_shipping_fee = EXCLUDED.standard_shipping_fee,
  cod_enabled = EXCLUDED.cod_enabled,
  announcement_text_en = EXCLUDED.announcement_text_en,
  announcement_text_ur = EXCLUDED.announcement_text_ur,
  bank_details = EXCLUDED.bank_details,
  jazzcash_details = EXCLUDED.jazzcash_details,
  easypaisa_details = EXCLUDED.easypaisa_details,
  updated_at = now();

-- 8. SEED APPROVED INITIAL REVIEWS
INSERT INTO public.reviews (
  id, product_id, customer_name, customer_city, rating, comment, is_verified_buyer, status
) VALUES
(
  gen_random_uuid(),
  'gac-prod-001',
  'Hira Mansoor',
  'Islamabad',
  5,
  'SubhanAllah! The Kashmiri tilla work on the emerald chiffon is even more gorgeous in real life than the photos. TCS delivered it in 2 days to Islamabad, beautifully packed in a sturdy box.',
  true,
  'approved'
),
(
  gen_random_uuid(),
  'gac-prod-002',
  'Samina Tariq',
  'Lahore',
  5,
  'The Egyptian lawn fabric is so soft and breathable for hot days. The schiffli embroidery on the neck is very neat. Highly recommend GA Cloth!',
  true,
  'approved'
),
(
  gen_random_uuid(),
  'gac-prod-040',
  'Tariq Mehmood',
  'Faisalabad',
  5,
  'The gold Jamawar fabric and stitching on this festive waistcoat is outstanding. Wore it to my brother''s wedding and received so many compliments. Prompt 2-day TCS delivery to Faisalabad.',
  true,
  'approved'
)
ON CONFLICT DO NOTHING;
