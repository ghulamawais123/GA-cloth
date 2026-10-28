/**
 * Types and Data Contracts for GA Cloth E-Commerce Platform
 * Focused exclusively on Physical Pakistani Fashion & Luxury Apparel
 */

export interface ProductVariant {
  id: string;
  size: string; // e.g. 'XS', 'S', 'M', 'L', 'XL', 'Unstitched', '38 Regular', '40 Regular', etc.
  color: string;
  colorHex: string;
  sku: string;
  stock: number;
  priceOverride?: number;
}

export interface Product {
  id: string;
  titleEn: string;
  titleUr: string;
  category: string;
  subcategory: string;
  price: number;
  salePrice?: number;
  isSale?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  fabric: string; // 'Lawn', 'Chiffon', 'Cotton', 'Jacquard', 'Silk', 'Velvet'
  pieceCount: '1-Piece' | '2-Piece' | '3-Piece';
  images: string[];
  descriptionEn: string;
  descriptionUr: string;
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  totalStock: number;
  washCareEn?: string;
  washCareUr?: string;
  brandLine?: string;
  features?: string[];
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  type?: 'physical';
}

export interface Category {
  id: string;
  nameEn: string;
  nameUr: string;
  slug: string;
  iconName: string;
  image: string;
  subcategories: string[];
  descriptionEn?: string;
  descriptionUr?: string;
}

export interface CartItem {
  id: string; // unique item key
  productId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card';
export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'failed';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineItem {
  status: OrderStatus;
  date: string;
  noteEn: string;
  noteUr: string;
}

export interface Order {
  id: string; // e.g. "GAC-89241"
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReferenceNumber?: string;
  paymentProofUrl?: string; // base64 or receipt image URL
  orderStatus: OrderStatus;
  tcsTrackingNumber?: string;
  notes?: string;
  timeline: OrderTimelineItem[];
  isDigitalOnly?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number; // e.g. 15 for 15% or 500 for PKR 500
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  descriptionEn: string;
  descriptionUr: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle?: string;
  customerName: string;
  customerCity?: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Banner {
  id: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  ctaTextEn: string;
  ctaTextUr: string;
  link: string;
  imageUrl: string;
  badgeEn?: string;
  badgeUr?: string;
  isActive: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number; // e.g. 3500 PKR
  standardShippingFee: number; // e.g. 250 PKR
  codEnabled: boolean;
  announcementTextEn: string;
  announcementTextUr: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  jazzCashDetails: {
    accountTitle: string;
    accountNumber: string;
  };
  easypaisaDetails: {
    accountTitle: string;
    accountNumber: string;
  };
}

export type UserRole = 'guest' | 'customer' | 'support_staff' | 'manager' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  savedAddresses: {
    id: string;
    label: string;
    city: string;
    province: string;
    address: string;
    isDefault: boolean;
  }[];
}
