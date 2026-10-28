import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Coupon,
  Review,
  Banner,
  StoreSettings,
  UserRole,
  ProductVariant,
  OrderStatus,
  PaymentStatus,
} from '../types/store';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_STORE_SETTINGS,
} from '../data/initialData';
import { Language, translations } from '../locales/translations';

interface FilterState {
  category: string;
  subCategory: string;
  minPrice: number;
  maxPrice: number;
  fabrics: string[];
  sizes: string[];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}

interface StoreContextType {
  // Navigation & Page State
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Localization & Role
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  banners: Banner[];
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, variantId: string, delta: number) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, noteEn?: string, noteUr?: string) => void;
  verifyOrderPayment: (orderId: string, status: PaymentStatus, note?: string) => void;
  assignTcsTracking: (orderId: string, trackingNumber: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'rejected') => void;

  // Modals & UI helpers
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  openAddProductModal: (productToEdit?: Product) => void;
  invoiceOrder: Order | null;
  setInvoiceOrder: (order: Order | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  subCategory: 'all',
  minPrice: 0,
  maxPrice: 25000,
  fabrics: [],
  sizes: [],
  inStockOnly: false,
  searchQuery: '',
  sortBy: 'newest',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('gac-prod-001');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Language & Role
  const [language, setLanguage] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');

  // Catalog State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners] = useState<Banner[]>(INITIAL_BANNERS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  // Cart State (Initialized with first product from 20 catalog)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'initial-cart-item',
      productId: INITIAL_PRODUCTS[0].id,
      product: INITIAL_PRODUCTS[0],
      selectedVariant: INITIAL_PRODUCTS[0].variants[0],
      quantity: 1,
      price: INITIAL_PRODUCTS[0].salePrice || INITIAL_PRODUCTS[0].price,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Orders & Reviews
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Modals & UI
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openAddProductModal = (productToEdit?: Product) => {
    setEditingProduct(productToEdit || null);
    setIsAddProductModalOpen(true);
  };

  // Apply RTL direction and font when language changes
  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Shipping calculation - always physical courier
  const shippingFee =
    cart.length === 0
      ? 0
      : subtotal >= storeSettings.freeShippingThreshold
      ? 0
      : storeSettings.standardShippingFee;

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    if (variant.stock < quantity) {
      showToast(language === 'ur' ? 'معذرت، مطلوبہ اسٹاک دستیاب نہیں ہے۔' : 'Sorry, requested quantity exceeds stock!');
      return;
    }

    const itemKey = `${product.id}-${variant.id}`;
    const itemPrice = variant.priceOverride || product.salePrice || product.price;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          product,
          selectedVariant: variant,
          quantity,
          price: itemPrice,
        },
      ];
    });

    showToast(
      language === 'ur'
        ? `شاپنگ بیگ میں شامل ہو گیا: ${product.titleUr}`
        : `Added to bag: ${product.titleEn}`
    );
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError(language === 'ur' ? 'یہ کوپن کوڈ درست نہیں ہے۔' : 'Invalid or expired coupon code.');
      return false;
    }

    if (subtotal < found.minOrder) {
      setCouponError(
        language === 'ur'
          ? `اس کوپن کے لیے کم از کم ${found.minOrder} روپے کا آرڈر درکار ہے۔`
          : `Minimum order of PKR ${found.minOrder.toLocaleString()} required for this coupon.`
      );
      return false;
    }

    setAppliedCoupon(found);
    showToast(language === 'ur' ? 'کوپن کامیابی سے لاگو ہو گیا!' : `Coupon "${found.code}" applied!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Orders Management
  const placeOrder = (orderData: Partial<Order>): Order => {
    const orderId = `GAC-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: Order = {
      id: orderId,
      date: now,
      customerName: orderData.customerName || 'Valued Customer',
      customerEmail: orderData.customerEmail || 'customer@example.com',
      customerPhone: orderData.customerPhone || '03001234567',
      shippingProvince: orderData.shippingProvince || 'Punjab',
      shippingCity: orderData.shippingCity || 'Lahore',
      shippingAddress: orderData.shippingAddress || 'Street 1, Lahore',
      deliveryNotes: orderData.deliveryNotes,
      items: [...cart],
      subtotal,
      discount,
      appliedCoupon: appliedCoupon?.code,
      shippingFee,
      total: grandTotal,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentMethod === 'card' ? 'paid' : 'pending',
      paymentReferenceNumber: orderData.paymentReferenceNumber,
      paymentProofUrl: orderData.paymentProofUrl,
      orderStatus: orderData.paymentMethod === 'card' ? 'confirmed' : 'placed',
      tcsTrackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}PK`,
      notes: orderData.notes,
      timeline: [
        {
          status: 'placed',
          date: now,
          noteEn: 'Order placed by customer.',
          noteUr: 'گاہک کی جانب سے آرڈر موصول ہوا۔',
        },
      ],
    };

    // Deduct stock
    cart.forEach((cartItem) => {
      adjustStock(cartItem.productId, cartItem.selectedVariant.id, -cartItem.quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(orderId);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, noteEn?: string, noteUr?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          orderStatus: status,
          timeline: [
            ...ord.timeline,
            {
              status,
              date: now,
              noteEn: noteEn || `Order status updated to ${status}.`,
              noteUr: noteUr || `آرڈر کا اسٹیٹس تبدیل کر کے ${status} کر دیا گیا۔`,
            },
          ],
        };
      })
    );
    showToast(language === 'ur' ? `آرڈر اسٹیٹس تبدیل ہو گیا: ${status}` : `Order status updated to ${status}`);
  };

  const verifyOrderPayment = (orderId: string, status: PaymentStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: status,
          notes: note || ord.notes,
          orderStatus: status === 'verified' && ord.orderStatus === 'placed' ? 'confirmed' : ord.orderStatus,
        };
      })
    );
    showToast(language === 'ur' ? 'ادائیگی کی توثیق مکمل ہو گئی!' : 'Payment verification updated!');
  };

  const assignTcsTracking = (orderId: string, trackingNumber: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, tcsTrackingNumber: trackingNumber } : ord))
    );
    showToast(language === 'ur' ? `TCS نمبر شامل کر دیا گیا: ${trackingNumber}` : `TCS Consignment # ${trackingNumber} assigned.`);
  };

  // Catalog adjustments
  const adjustStock = (productId: string, variantId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedVariants = p.variants.map((v) =>
          v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v
        );
        const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return { ...p, variants: updatedVariants, totalStock: newTotalStock };
      })
    );
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `gac-prod-${Date.now().toString().slice(-4)}`;
    const newProd: Product = { ...productData, id: newId, type: 'physical' };
    setProducts((prev) => [newProd, ...prev]);
    showToast(language === 'ur' ? 'نیا پروڈکٹ کامیابی سے شامل ہوا!' : 'Product added successfully!');
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast(language === 'ur' ? 'پروڈکٹ اپ ڈیٹ ہو گئی!' : 'Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'ur' ? 'پروڈکٹ حذف ہو گئی!' : 'Product removed from catalog.');
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast('New coupon created!');
  };

  const updateCoupon = (code: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, ...updates } : c)));
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  // Reviews
  const addReview = (revData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...revData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Pending admin approval
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast(
      language === 'ur'
        ? 'شکریہ! آپ کا تبصرہ ایڈمن کی منظوری کے بعد شائع ہو جائے گا۔'
        : 'Thank you! Your verified review will appear once approved by admin.'
    );
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    showToast(`Review marked as ${status}.`);
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast(language === 'ur' ? 'اسٹور سیٹنگز محفوظ ہو گئیں!' : 'Store settings saved successfully!');
  };

  const t = translations[language];

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        products,
        categories,
        banners,
        storeSettings,
        updateStoreSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        grandTotal,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        filters,
        setFilters,
        resetFilters,
        orders,
        placeOrder,
        updateOrderStatus,
        verifyOrderPayment,
        assignTcsTracking,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        reviews,
        addReview,
        moderateReview,
        isAiModalOpen,
        setIsAiModalOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        editingProduct,
        setEditingProduct,
        openAddProductModal,
        invoiceOrder,
        setInvoiceOrder,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
