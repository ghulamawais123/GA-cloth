import { Product, Category, Coupon, Review, Banner, StoreSettings, Order } from '../types/store';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-unstitched',
    nameEn: 'Unstitched Lawn',
    nameUr: 'ان سلے لان سوٹ',
    slug: 'unstitched',
    iconName: 'Scissors',
    image: 'https://kommodo.ai/i/bb4S6Rp9bSmMS7ERDvX9',
    subcategories: ['3-Piece Lawn', '2-Piece Printed', 'Chiffon Dupatta Suits', 'Jacquard Festive'],
    descriptionEn: 'Premium Pakistani unstitched fabrics with intricate threadwork, zari, and digital prints.',
    descriptionUr: 'اعلیٰ کوالٹی کے ان سلے لان سوٹ، نفیس زری اور دھاگے کی کڑھائی کے ساتھ۔',
  },
  {
    id: 'cat-pret',
    nameEn: 'Ready-to-Wear Pret',
    nameUr: 'ریڈی میڈ کُرتے (پریٹ)',
    slug: 'pret',
    iconName: 'Shirt',
    image: 'https://kommodo.ai/i/9j3SWBJwiwCieTBH7Ap1',
    subcategories: ['Single Kurtis', '2-Piece Pret Sets', 'Formal Tunics', 'Daily Casuals'],
    descriptionEn: 'Contemporary cuts and bespoke tailored silhouettes ready for your daily and work moments.',
    descriptionUr: 'جدید تراش خراش والے سلے سلائے خوبصورت کُرتے اور دو پیس سیٹ۔',
  },
  {
    id: 'cat-festive',
    nameEn: 'Festive & Chiffon',
    nameUr: 'شادی و تہوار کلیکشن',
    slug: 'festive',
    iconName: 'Sparkles',
    image: 'https://kommodo.ai/i/TcKbpIl6et9uGlPdPzM2',
    subcategories: ['Luxury Chiffon', 'Pure Velvet Shawls', 'Hand-worked Organza', 'Wedding Formals'],
    descriptionEn: 'Regal wedding ensembles embellished with sequins, pearl beads, and gold dabka.',
    descriptionUr: 'شادی بیاہ اور خاص تہواروں کے لیے شاہانہ ملبوسات، موتی اور سلمہ ستارے کے کام کے ساتھ۔',
  },
  {
    id: 'cat-menswear',
    nameEn: 'Menswear',
    nameUr: 'مردانہ کُرتے و واسکٹ',
    slug: 'menswear',
    iconName: 'User',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Cotton Kurta Pajama', 'Embroidered Kurtas', 'Festive Waistcoats', 'Latha Fabric'],
    descriptionEn: 'Crisp Egyptian cotton, tailored collars, and handcrafted buttons for the modern gentleman.',
    descriptionUr: 'خالص مصری سوتی کپڑا، شاندار کالر اور نفاست سے سلے مردانہ کرتے اور واسکٹ۔',
  },
];

// Helper to generate catalog items with distinctive physical properties
const createProduct = (
  idNum: number,
  titleEn: string,
  titleUr: string,
  category: string,
  subcategory: string,
  price: number,
  salePrice: number | undefined,
  fabric: string,
  pieceCount: '1-Piece' | '2-Piece' | '3-Piece',
  imageUrl: string,
  opts: {
    isFlashDeal?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    isSale?: boolean;
    brandLine?: string;
    colors?: { name: string; hex: string }[];
    sizes?: string[];
    rating?: number;
    reviewsCount?: number;
    descriptionEn?: string;
    descriptionUr?: string;
  } = {}
): Product => {
  const isSale = Boolean(salePrice && salePrice < price);
  const defaultBrand =
    opts.brandLine ||
    (category === 'cat-unstitched'
      ? 'GA LAWN COUTURE'
      : category === 'cat-pret'
      ? 'GA PRET ATELIER'
      : category === 'cat-festive'
      ? 'GA FESTIVE SIGNATURE'
      : 'GA BESPOKE MEN');

  const colorList = opts.colors || [
    { name: 'Royal Emerald', hex: '#0b5239' },
    { name: 'Deep Burgundy', hex: '#581825' },
    { name: 'Midnight Charcoal', hex: '#1e222d' },
  ];
  const sizeList = opts.sizes || ['Unstitched', 'Small', 'Medium', 'Large'];

  const variants = colorList.flatMap((col, colIdx) =>
    sizeList.map((sz, szIdx) => ({
      id: `v-${idNum}-${colIdx}-${szIdx}`,
      size: sz,
      color: col.name,
      colorHex: col.hex,
      sku: `GAC-${fabric.slice(0, 3).toUpperCase()}-${idNum}-${sz.slice(0, 1)}`,
      stock: Math.floor(8 + Math.random() * 18),
      priceOverride: undefined,
    }))
  );

  const totalStock = variants.reduce((s, v) => s + v.stock, 0);

  return {
    id: `gac-prod-${String(idNum).padStart(3, '0')}`,
    titleEn,
    titleUr,
    category,
    subcategory,
    price,
    salePrice,
    isSale,
    isNew: opts.isNew !== undefined ? opts.isNew : idNum > 20,
    isFeatured: opts.isFeatured !== undefined ? opts.isFeatured : idNum % 2 === 1,
    isFlashDeal: opts.isFlashDeal !== undefined ? opts.isFlashDeal : false,
    fabric,
    pieceCount,
    brandLine: defaultBrand,
    images: [imageUrl],
    descriptionEn: opts.descriptionEn || `An exceptional Pakistani handcrafted masterpiece from ${defaultBrand}, tailored from genuine ${fabric}. Featuring authentic zari, tilla thread embroidery, and fine craftsmanship designed for elegance and supreme comfort.`,
    descriptionUr: opts.descriptionUr || `خالص ${fabric} پر تیار کردہ شاہکار پاکستانی جوڑا (${defaultBrand})۔ نفیس کڑھائی، زری اور ریشم کے کام کے ساتھ پروقار تقریبات کے لیے بہترین۔`,
    variants,
    rating: opts.rating || +(4.7 + Math.random() * 0.3).toFixed(1),
    reviewsCount: opts.reviewsCount || Math.floor(18 + Math.random() * 32),
    tags: [fabric, pieceCount, category.replace('cat-', ''), defaultBrand],
    totalStock,
    washCareEn: 'Dry clean recommended. Gentle reverse iron with low temperature.',
    washCareUr: 'ڈرائی کلین کی سفارش کی جاتی ہے۔ الٹی طرف سے ہلکی استری کریں۔',
    features: [
      `100% Genuine Pakistani ${fabric}`,
      'Fine Resham Threadwork & Zari Borders',
      'Generous Fabric Length for Custom Tailoring',
      'TCS Express 2-4 Days Fast Delivery',
    ],
    type: 'physical',
  };
};

// Exactly 20 Physical Luxury Products (5 in each of the 4 categories)
export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================================
  // 1. UNSTITCHED LAWN (5 Selected Products: 1, 2, 3, 4, 6)
  // ==========================================================
  createProduct(
    1,
    'Noor-e-Kashmir Embroidered Chiffon 3-Piece',
    'نورِ کشمیر کڑھائی دار شفون ۳ پیس سوٹ',
    'cat-unstitched',
    'Chiffon Dupatta Suits',
    8490,
    6990,
    'Chiffon',
    '3-Piece',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA LAWN COUTURE',
      isFlashDeal: true,
      isFeatured: true,
      colors: [
        { name: 'Kashmir Maroon', hex: '#631626' },
        { name: 'Royal Gold', hex: '#c59d42' },
        { name: 'Forest Green', hex: '#16432b' },
      ],
    }
  ),
  createProduct(
    2,
    'Gul-e-Dawood Hand-Embroidered Lawn 3-Piece',
    'گلِ داؤد ہینڈ کڑھائی دار لان ۳ پیس',
    'cat-unstitched',
    '3-Piece Lawn',
    4950,
    4200,
    'Lawn',
    '3-Piece',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA LAWN COUTURE',
      isFlashDeal: true,
      isFeatured: true,
      colors: [
        { name: 'Sky Aqua', hex: '#2e7d9e' },
        { name: 'Ivory Cream', hex: '#f2ece1' },
        { name: 'Powder Blue', hex: '#87adc4' },
      ],
    }
  ),
  createProduct(
    3,
    'Chandni Printed Summer Lawn 2-Piece',
    'چاندنی پرنٹڈ سمر لان ۲ پیس',
    'cat-unstitched',
    '2-Piece Printed',
    3450,
    2990,
    'Lawn',
    '2-Piece',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA DAILY LAWN',
      isSale: true,
      colors: [
        { name: 'Summer Yellow', hex: '#eab308' },
        { name: 'Lilac Floral', hex: '#a855f7' },
        { name: 'Mint Green', hex: '#10b981' },
      ],
    }
  ),
  createProduct(
    4,
    'Bahar-e-Nau Organza Dupatta Lawn Suit',
    'بہارِ نو اورگنزا دوپٹہ لان سوٹ',
    'cat-unstitched',
    'Chiffon Dupatta Suits',
    5650,
    4850,
    'Lawn',
    '3-Piece',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA SIGNATURE LAWN',
      colors: [
        { name: 'Emerald Jade', hex: '#064e3b' },
        { name: 'Golden Olive', hex: '#854d0e' },
      ],
    }
  ),
  createProduct(
    6,
    'Mehrunissa Embroidered Lawn with Silk Dupatta',
    'مہرالنساء کڑھائی دار لان بمع سلک دوپٹہ',
    'cat-unstitched',
    '3-Piece Lawn',
    6200,
    5400,
    'Lawn',
    '3-Piece',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA HERITAGE LAWN',
      isFeatured: true,
      isNew: true,
      colors: [
        { name: 'Crimson Wine', hex: '#881337' },
        { name: 'Gilded Bronze', hex: '#78350f' },
      ],
    }
  ),

  // ==========================================================
  // 2. READY-TO-WEAR PRET (5 Selected Products: 13, 14, 15, 17, 21)
  // ==========================================================
  createProduct(
    13,
    'Zari Jacquard Pret Kurti with Pearl Tassels',
    'زری جیکارڈ سلی سلائی کُرتی بمع پرل ٹیسلز',
    'cat-pret',
    'Single Kurtis',
    3650,
    2990,
    'Jacquard',
    '1-Piece',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA PRET ATELIER',
      isFeatured: true,
      sizes: ['Small', 'Medium', 'Large', 'XL'],
      colors: [
        { name: 'Rose Quartz', hex: '#f43f5e' },
        { name: 'Shimmer Champagne', hex: '#fef08a' },
      ],
    }
  ),
  createProduct(
    14,
    'Kashmiri Tilla Embroidered Linen Tunic',
    'کشمیری تلا کڑھائی والی لِنن کُرتی',
    'cat-pret',
    'Formal Tunics',
    4200,
    3600,
    'Cotton',
    '1-Piece',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA PRET ATELIER',
      sizes: ['Small', 'Medium', 'Large'],
      colors: [
        { name: 'Terracotta Rust', hex: '#c2410c' },
        { name: 'Cinnamon Clay', hex: '#9a3412' },
      ],
    }
  ),
  createProduct(
    15,
    'Rangrez Block-Printed 2-Piece Pret Set',
    'رنگریز بلاک پرنٹڈ ۲ پیس پریٹ سیٹ',
    'cat-pret',
    '2-Piece Pret Sets',
    5450,
    4650,
    'Lawn',
    '2-Piece',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA URBAN PRET',
      isNew: true,
      sizes: ['Small', 'Medium', 'Large'],
      colors: [
        { name: 'Indigo Monochrome', hex: '#1e293b' },
        { name: 'Ivory Geo', hex: '#f8fafc' },
      ],
    }
  ),
  createProduct(
    17,
    'Raw Silk Pret Co-ord Set with Cutwork',
    'را سلک پریٹ کو آرڈ سیٹ بمع کٹ ورک',
    'cat-pret',
    '2-Piece Pret Sets',
    7850,
    6950,
    'Silk',
    '2-Piece',
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA SIGNATURE COUTURE',
      isFeatured: true,
      sizes: ['Small', 'Medium', 'Large'],
      colors: [
        { name: 'Midnight Obsidian', hex: '#020617' },
        { name: 'Silver Slate', hex: '#475569' },
      ],
    }
  ),
  createProduct(
    21,
    'Gulberg Velvet Evening Pret Tunic',
    'گلبرگ ویلوٹ ایوننگ پریٹ کُرتی',
    'cat-pret',
    'Formal Tunics',
    7500,
    6200,
    'Velvet',
    '1-Piece',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA LUXURY EVENING',
      isFlashDeal: true,
      sizes: ['Small', 'Medium', 'Large'],
      colors: [
        { name: 'Raven Black', hex: '#09090b' },
        { name: 'Gold Leaf', hex: '#eab308' },
      ],
    }
  ),

  // ==========================================================
  // 3. FESTIVE & CHIFFON (5 Selected Products: 25, 26, 27, 28, 35)
  // ==========================================================
  createProduct(
    25,
    'Shahkaar Regal Velvet Shawl Formal Ensemble',
    'شاہکار ریگل ویلوٹ شال فارمل سوٹ',
    'cat-festive',
    'Pure Velvet Shawls',
    14500,
    11900,
    'Velvet',
    '3-Piece',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA ROYAL COUTURE',
      isFeatured: true,
      colors: [
        { name: 'Deep Burgundy Velvet', hex: '#4c0519' },
        { name: 'Emerald Velvet', hex: '#022c22' },
      ],
    }
  ),
  createProduct(
    26,
    'Koh-e-Noor Zari Chiffon Wedding 3-Piece',
    'کوہِ نور زری شفون ویڈنگ ۳ پیس',
    'cat-festive',
    'Luxury Chiffon',
    12800,
    10500,
    'Chiffon',
    '3-Piece',
    'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA FESTIVE SIGNATURE',
      isFlashDeal: true,
      colors: [
        { name: 'Champagne Shimmer', hex: '#fef3c7' },
        { name: 'Soft Peach', hex: '#ffedd5' },
      ],
    }
  ),
  createProduct(
    27,
    'Dilkash Handworked Organza Bridal Pishwas',
    'دلکش ہینڈ ورکڈ اورگنزا برائیڈل پیشواز',
    'cat-festive',
    'Hand-worked Organza',
    18500,
    15900,
    'Chiffon',
    '3-Piece',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BRIDAL ATELIER',
      isFeatured: true,
      colors: [
        { name: 'Marigold Ochre', hex: '#f59e0b' },
        { name: 'Sunset Terracotta', hex: '#ea580c' },
      ],
    }
  ),
  createProduct(
    28,
    'Shahi Mehal Pure Raw Silk Formal 3-Piece',
    'شاہی محل پیور را سلک فارمل ۳ پیس',
    'cat-festive',
    'Wedding Formals',
    13900,
    11500,
    'Silk',
    '3-Piece',
    'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA ROYAL COUTURE',
      colors: [
        { name: 'Gilded Zari', hex: '#d97706' },
        { name: 'Copper Rust', hex: '#9a3412' },
      ],
    }
  ),
  createProduct(
    35,
    'Mehr-o-Mah Hand-worked Zari Net Peshwas',
    'مہر و ماہ ہینڈ ورکڈ زری نیٹ پیشواز',
    'cat-festive',
    'Wedding Formals',
    16800,
    13900,
    'Chiffon',
    '3-Piece',
    'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BRIDAL ATELIER',
      isFeatured: true,
      isNew: true,
      colors: [
        { name: 'Glistening Gold', hex: '#facc15' },
        { name: 'Ivory Frost', hex: '#f8fafc' },
      ],
    }
  ),

  // ==========================================================
  // 4. MENSWEAR (5 Selected Products: 37, 38, 39, 40, 42)
  // ==========================================================
  createProduct(
    37,
    'Quaid Classic White Egyptian Cotton Suit',
    'قائد کلاسک سفید مصری سوتی سوٹ',
    'cat-menswear',
    'Latha Fabric',
    4450,
    3800,
    'Cotton',
    '2-Piece',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BESPOKE MEN',
      isFeatured: true,
      colors: [
        { name: 'Pristine Snow White', hex: '#ffffff' },
        { name: 'Warm Off-White Latha', hex: '#fefce8' },
      ],
      sizes: ['Small (38)', 'Medium (40)', 'Large (42)', 'XL (44)'],
    }
  ),
  createProduct(
    38,
    'Charcoal Black Boski Soft Kurta Pajama',
    'چارکول بلیک بوسکی نرم کُرتا پاجامہ',
    'cat-menswear',
    'Cotton Kurta Pajama',
    5200,
    4450,
    'Silk',
    '2-Piece',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BESPOKE MEN',
      isFlashDeal: true,
      colors: [
        { name: 'Charcoal Black', hex: '#18181b' },
        { name: 'Jet Noir', hex: '#09090b' },
      ],
      sizes: ['Small (38)', 'Medium (40)', 'Large (42)', 'XL (44)'],
    }
  ),
  createProduct(
    39,
    'Royal Navy Embroidered Collar Cotton Kurta',
    'رائل نیوی کڑھائی دار بین کالر کُرتا',
    'cat-menswear',
    'Embroidered Kurtas',
    3950,
    3350,
    'Cotton',
    '1-Piece',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BESPOKE MEN',
      isNew: true,
      colors: [
        { name: 'Navy Midnight', hex: '#1e3a8a' },
        { name: 'Steel Blue', hex: '#3b82f6' },
      ],
      sizes: ['Small (38)', 'Medium (40)', 'Large (42)', 'XL (44)'],
    }
  ),
  createProduct(
    40,
    'Jamawar Brocade Gold Festive Waistcoat',
    'جامہ وار بروکیڈ گولڈ فیسٹیو واسکٹ',
    'cat-menswear',
    'Festive Waistcoats',
    6500,
    5200,
    'Jacquard',
    '1-Piece',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA REGAL GENTLEMEN',
      isFeatured: true,
      colors: [
        { name: 'Imperial Gold Jamawar', hex: '#d97706' },
        { name: 'Bronze Velvet', hex: '#78350f' },
      ],
      sizes: ['38 Regular', '40 Regular', '42 Regular', '44 Regular'],
    }
  ),
  createProduct(
    42,
    'Olive Khaki Raw Silk Groom Kurta',
    'زیتونی خاکی را سلک گروم کُرتا',
    'cat-menswear',
    'Embroidered Kurtas',
    5800,
    4900,
    'Silk',
    '1-Piece',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    {
      brandLine: 'GA BESPOKE MEN',
      colors: [
        { name: 'Olive Green', hex: '#3f6212' },
        { name: 'Earthy Khaki', hex: '#713f12' },
      ],
      sizes: ['Small (38)', 'Medium (40)', 'Large (42)', 'XL (44)'],
    }
  ),
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AZADI15',
    discountType: 'percent',
    value: 15,
    minOrder: 3000,
    maxDiscount: 2500,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 284,
    isActive: true,
    descriptionEn: '15% off on orders above PKR 3,000',
    descriptionUr: '۳۰۰۰ روپے سے زیادہ کے آرڈر پر ۱۵٪ رعایت',
  },
  {
    code: 'WELCOME10',
    discountType: 'percent',
    value: 10,
    minOrder: 1500,
    maxDiscount: 1500,
    expiryDate: '2026-11-30',
    usageLimit: 500,
    usedCount: 112,
    isActive: true,
    descriptionEn: '10% off for first-time shoppers',
    descriptionUr: 'پہلی بار خریداری کرنے والے خریداروں کے لیے ۱۰٪ رعایت',
  },
  {
    code: 'GA1000',
    discountType: 'fixed',
    value: 1000,
    minOrder: 8000,
    expiryDate: '2026-12-15',
    usageLimit: 200,
    usedCount: 65,
    isActive: true,
    descriptionEn: 'PKR 1,000 flat discount on luxury festive orders over PKR 8,000',
    descriptionUr: '۸۰۰۰ روپے سے زائد کے آرڈر پر فلیٹ ۱۰۰۰ روپے کی بچت',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'GAC-89241',
    date: '2026-10-21 14:32',
    customerName: 'Ayesha Siddiqui',
    customerEmail: 'ayesha.siddiqui@gmail.com',
    customerPhone: '03014589211',
    shippingProvince: 'Punjab',
    shippingCity: 'Lahore',
    shippingAddress: 'House 42-B, Sector Y, Phase 3, DHA, Lahore',
    deliveryNotes: 'Please ring bell twice or call on arrival.',
    items: [
      {
        id: 'cart-item-1',
        productId: 'gac-prod-001',
        product: INITIAL_PRODUCTS[0],
        selectedVariant: INITIAL_PRODUCTS[0].variants[0],
        quantity: 1,
        price: 6990,
      },
    ],
    subtotal: 6990,
    discount: 1048,
    appliedCoupon: 'AZADI15',
    shippingFee: 0,
    total: 5942,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'verified',
    paymentReferenceNumber: 'MEEZAN-TRX-9482710',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554415707-9e49017a1430?auto=format&fit=crop&w=600&q=80',
    orderStatus: 'shipped',
    tcsTrackingNumber: 'TCS-92837412PK',
    notes: 'Payment verified by Admin Tariq via Meezan Bank statement.',
    timeline: [
      { status: 'placed', date: '2026-10-21 14:32', noteEn: 'Order placed by customer via Bank Transfer.', noteUr: 'گاہک کی جانب سے آرڈر درج کیا گیا۔' },
      { status: 'confirmed', date: '2026-10-21 15:10', noteEn: 'Payment verified & order confirmed.', noteUr: 'ادائیگی کی تصدیق اور آرڈر منظور۔' },
      { status: 'packed', date: '2026-10-21 17:45', noteEn: 'Suit inspected and packed in luxury GA Cloth gift box.', noteUr: 'سوٹ کوالٹی چیک کے بعد باکس میں پیک ہو گیا۔' },
      { status: 'shipped', date: '2026-10-22 09:20', noteEn: 'Dispatched via TCS Express courier consignment #TCS-92837412PK.', noteUr: 'ٹی سی ایس ایکسپریس کے حوالے کر دیا گیا، کنسائنمنٹ نمبر TCS-92837412PK' },
    ],
  },
  {
    id: 'GAC-89242',
    date: '2026-10-21 18:40',
    customerName: 'Bilal Farooq',
    customerEmail: 'bilal.f@outlook.com',
    customerPhone: '03219874523',
    shippingProvince: 'Sindh',
    shippingCity: 'Karachi',
    shippingAddress: 'Flat 304, Al-Buraq Heights, Block 13-D, Gulshan-e-Iqbal, Karachi',
    deliveryNotes: 'Deliver during daytime please.',
    items: [
      {
        id: 'cart-item-2',
        productId: 'gac-prod-037',
        product: INITIAL_PRODUCTS[15],
        selectedVariant: INITIAL_PRODUCTS[15].variants[0],
        quantity: 1,
        price: 3800,
      },
    ],
    subtotal: 3800,
    discount: 0,
    shippingFee: 0,
    total: 3800,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'packed',
    tcsTrackingNumber: 'TCS-71049382PK',
    notes: 'Cash on delivery order. Customer verified via phone call.',
    timeline: [
      { status: 'placed', date: '2026-10-21 18:40', noteEn: 'Cash on delivery order received.', noteUr: 'کیش آن ڈیلیوری آرڈر موصول ہوا۔' },
      { status: 'confirmed', date: '2026-10-21 19:15', noteEn: 'Order confirmed by customer support.', noteUr: 'کسٹمر سپورٹ کی طرف سے آرڈر کنفرم ہوا۔' },
      { status: 'packed', date: '2026-10-22 08:30', noteEn: 'Parcel packaged with invoice attached.', noteUr: 'پارسل انوائس کے ساتھ تیار ہے۔' },
    ],
  },
  {
    id: 'GAC-89243',
    date: '2026-10-22 10:15',
    customerName: 'Zainab Fatima',
    customerEmail: 'zainab.f@gmail.com',
    customerPhone: '03335544332',
    shippingProvince: 'Islamabad Capital Territory',
    shippingCity: 'Islamabad',
    shippingAddress: 'House 14, Street 29, Sector F-7/1, Islamabad',
    deliveryNotes: 'Leave with guard if not answering bell.',
    items: [
      {
        id: 'cart-item-3',
        productId: 'gac-prod-025',
        product: INITIAL_PRODUCTS[10],
        selectedVariant: INITIAL_PRODUCTS[10].variants[0],
        quantity: 1,
        price: 11900,
      },
    ],
    subtotal: 11900,
    discount: 1000,
    appliedCoupon: 'GA1000',
    shippingFee: 0,
    total: 10900,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    paymentReferenceNumber: 'PAYFAST-CARD-839120',
    orderStatus: 'confirmed',
    tcsTrackingNumber: 'TCS-8392104PK',
    notes: 'Paid securely via 3DS card checkout. Packed in bridal garment bag.',
    timeline: [
      { status: 'placed', date: '2026-10-22 10:15', noteEn: 'Order placed with online card payment.', noteUr: 'کارڈ کے ذریعے آن لائن آرڈر موصول ہوا۔' },
      { status: 'confirmed', date: '2026-10-22 10:16', noteEn: 'Payment captured securely via 3DS OTP.', noteUr: 'ادائیگی فوری طور پر موصول اور تصدیق شدہ۔' },
    ],
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'gac-prod-001',
    productTitle: 'Noor-e-Kashmir Embroidered Chiffon 3-Piece',
    customerName: 'Hira Mansoor',
    customerCity: 'Islamabad',
    rating: 5,
    comment: 'SubhanAllah! The Kashmiri tilla work on the emerald chiffon is even more gorgeous in real life than the photos. TCS delivered it in 2 days to Islamabad, beautifully packed in a sturdy box.',
    date: '2026-10-18',
    isVerifiedBuyer: true,
    status: 'approved',
  },
  {
    id: 'rev-2',
    productId: 'gac-prod-002',
    productTitle: 'Gul-e-Dawood Hand-Embroidered Lawn 3-Piece',
    customerName: 'Samina Tariq',
    customerCity: 'Lahore',
    rating: 5,
    comment: 'The Egyptian lawn fabric is so soft and breathable for hot days. The schiffli embroidery on the neck is very neat. Highly recommend GA Cloth!',
    date: '2026-10-19',
    isVerifiedBuyer: true,
    status: 'approved',
  },
  {
    id: 'rev-3',
    productId: 'gac-prod-040',
    productTitle: 'Jamawar Brocade Gold Festive Waistcoat',
    customerName: 'Tariq Mehmood',
    customerCity: 'Faisalabad',
    rating: 5,
    comment: 'The gold Jamawar fabric and stitching on this festive waistcoat is outstanding. Wore it to my brother\'s wedding and received so many compliments. Prompt 2-day TCS delivery to Faisalabad.',
    date: '2026-10-20',
    isVerifiedBuyer: true,
    status: 'approved',
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    titleEn: 'Autumn Festive Volume 2026',
    titleUr: 'خزان کا پروقار فیسٹیو والیوم ۲۰۲۶',
    subtitleEn: 'Intricately embroidered chiffon, royal velvets, and luxury lawn crafted for the wedding season.',
    subtitleUr: 'شادی کے سیزن کے لیے خالص مخمل اور نفیس کڑھائی والے شفون ملبوسات۔',
    ctaTextEn: 'Explore Festive Suits',
    ctaTextUr: 'فیسٹیو کلیکشن دیکھیں',
    link: '/shop?category=cat-festive',
    imageUrl: 'https://kommodo.ai/i/zjxalCvDgmbtQLSM51YS',
    badgeEn: 'New Festive Drop',
    badgeUr: 'تازہ ترین کلیکشن',
    isActive: true,
  },
  {
    id: 'ban-2',
    titleEn: 'Ready-to-Wear Pret & Menswear',
    titleUr: 'ریڈی میڈ کُرتے اور مردانہ فیسٹیو کلیکشن',
    subtitleEn: 'Bespoke Egyptian cotton kurtas, embroidered festive waistcoats, and contemporary pret for modern occasions.',
    subtitleUr: 'شاندار سلے سلائے کُرتے اور زری واسکٹ، جدید فیشن اور روایتی نفاست کے ساتھ۔',
    ctaTextEn: 'Browse Pret Collection',
    ctaTextUr: 'پریٹ کلیکشن دیکھیں',
    link: '/shop?category=cat-pret',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    badgeEn: 'Handcrafted Drops',
    badgeUr: 'ہینڈ کرافٹڈ کلیکشن',
    isActive: true,
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  freeShippingThreshold: 3500, // PKR
  standardShippingFee: 250, // PKR
  codEnabled: true,
  announcementTextEn: '✨ FESTIVE OFFER: Use coupon AZADI15 for 15% OFF! Free Nationwide TCS Delivery over PKR 3,500.',
  announcementTextUr: '✨ فیسٹیو آفر: کوڈ AZADI15 لگائیں اور پائیں 15٪ رعایت! ۳۵۰۰ روپے سے زائد کے آرڈر پر مفت TCS ڈلیوری۔',
  bankDetails: {
    bankName: 'Meezan Bank Limited (Islamic Banking)',
    accountTitle: 'GA CLOTH APPAREL SMC PVT LTD',
    accountNumber: '02840105829102',
    iban: 'PK45MEZN0002840105829102',
    branchCode: '0284 (Gulberg III Lahore)',
  },
  jazzCashDetails: {
    accountTitle: 'GA Cloth Official',
    accountNumber: '0300-1234567',
  },
  easypaisaDetails: {
    accountTitle: 'GA Cloth Official',
    accountNumber: '0345-9876543',
  },
};

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Sargodha',
  'Bahawalpur',
  'Abbottabad',
  'Sukkur',
  'Gujrat',
  'Jhelum',
  'Mardan',
  'Muzaffarabad',
  'Mirpur (AJK)',
  'Gilgit',
  'Rahim Yar Khan',
  'Sheikhupura',
  'Dera Ghazi Khan',
];

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];
