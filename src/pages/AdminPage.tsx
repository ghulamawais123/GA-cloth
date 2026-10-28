import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Ticket,
  MessageSquare,
  Settings,
  Users,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Truck,
  Printer,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  FileCheck,
  Download,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { OrderStatus, PaymentStatus, Product, ProductVariant } from '../types/store';

export const AdminPage: React.FC = () => {
  const {
    userRole,
    setUserRole,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    categories,
    orders,
    updateOrderStatus,
    verifyOrderPayment,
    assignTcsTracking,
    coupons,
    addCoupon,
    deleteCoupon,
    reviews,
    moderateReview,
    storeSettings,
    updateStoreSettings,
    setInvoiceOrder,
    openAddProductModal,
    language,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'coupons' | 'reviews' | 'settings' | 'staff'
  >('dashboard');

  // Order management state
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForTcs, setSelectedOrderForTcs] = useState<string | null>(null);
  const [tcsInput, setTcsInput] = useState('');
  const [selectedProofOrder, setSelectedProofOrder] = useState<any | null>(null);

  // Product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodTitleUr, setProdTitleUr] = useState('');
  const [prodCategory, setProdCategory] = useState('cat-unstitched');
  const [prodSubCategory, setProdSubCategory] = useState('3-Piece Lawn');
  const [prodPrice, setProdPrice] = useState(4950);
  const [prodSalePrice, setProdSalePrice] = useState<number | undefined>(4200);
  const [prodFabric, setProdFabric] = useState('Lawn');
  const [prodPieces, setProdPieces] = useState<'1-Piece' | '2-Piece' | '3-Piece'>('3-Piece');
  const prodType = 'physical';
  const [prodImageUrl, setProdImageUrl] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  );
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescUr, setProdDescUr] = useState('');
  const [prodStock, setProdStock] = useState(25);
  const [prodEmbroidery, setProdEmbroidery] = useState('Zari, sequins and resham threadwork');
  const [prodSeason, setProdSeason] = useState('Festive Autumn');

  // AI Description Generator State
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponMin, setNewCouponMin] = useState(3000);

  // Permissions check based on PRD:
  // Super Admin: All
  // Manager: Products, Categories, Inventory, Coupons, Reviews, Settings (no Staff)
  // Support Staff: Orders & Reviews only
  const canAccessSettings = userRole === 'super_admin';
  const canAccessStaff = userRole === 'super_admin';
  const canManageProducts = userRole === 'super_admin' || userRole === 'manager';

  // Metrics calculations
  const totalSalesPKR = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'placed').length;
  const lowStockCount = products.filter((p) => p.totalStock < 10).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  // AI Product Description Generator with Argon High-Thinking
  const handleGenerateAiDescription = async () => {
    if (!prodTitleEn && !prodFabric) {
      showToast('Please enter at least a working Title or Fabric type');
      return;
    }

    setIsAiGenerating(true);
    setAiGeneratedSuccess(false);

    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prodTitleEn || 'Pakistani Luxury Suit',
          category: categories.find((c) => c.id === prodCategory)?.nameEn || 'Unstitched',
          fabric: prodFabric,
          pieces: prodPieces,
          embroidery: prodEmbroidery,
          season: prodSeason,
          isDigital: false,
          color: 'Royal Festive Palette',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.titleEn) setProdTitleEn(data.data.titleEn);
        if (data.data.titleUr) setProdTitleUr(data.data.titleUr);
        if (data.data.descriptionEn) setProdDescEn(data.data.descriptionEn);
        if (data.data.descriptionUr) setProdDescUr(data.data.descriptionUr);
        setAiGeneratedSuccess(true);
        showToast('AI crafted luxury English & Urdu descriptions successfully!');
      }
    } catch (err) {
      console.error('Failed to generate AI description:', err);
      showToast('Could not reach AI copywriter. Please try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const variants: ProductVariant[] = [
      {
        id: `v-${Date.now()}-1`,
        size: 'Unstitched',
        color: 'Primary Color',
        colorHex: '#c25534',
        sku: `GAC-${prodFabric.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
        stock: prodStock,
      },
    ];

    if (editingProductId) {
      updateProduct(editingProductId, {
        titleEn: prodTitleEn,
        titleUr: prodTitleUr || prodTitleEn,
        category: prodCategory,
        subcategory: prodSubCategory,
        price: Number(prodPrice),
        salePrice: prodSalePrice ? Number(prodSalePrice) : undefined,
        fabric: prodFabric,
        pieceCount: prodPieces,
        type: prodType,
        images: [prodImageUrl],
        descriptionEn: prodDescEn,
        descriptionUr: prodDescUr,
        totalStock: Number(prodStock),
      });
    } else {
      addProduct({
        titleEn: prodTitleEn,
        titleUr: prodTitleUr || prodTitleEn,
        category: prodCategory,
        subcategory: prodSubCategory,
        price: Number(prodPrice),
        salePrice: prodSalePrice ? Number(prodSalePrice) : undefined,
        isSale: Boolean(prodSalePrice && prodSalePrice < prodPrice),
        isNew: true,
        type: prodType,
        fabric: prodFabric,
        pieceCount: prodPieces,
        images: [prodImageUrl],
        descriptionEn: prodDescEn,
        descriptionUr: prodDescUr,
        variants,
        rating: 5.0,
        reviewsCount: 1,
        tags: [prodFabric, prodPieces, 'New'],
        totalStock: Number(prodStock),
        washCareEn: 'Dry clean recommended. Gentle reverse iron.',
        washCareUr: 'ڈرائی کلین کی سفارش کی جاتی ہے۔',
        features: ['Premium Egyptian Lawn / Silk', 'Authentic Embroidery', 'Complete Yardage'],
      });
    }

    setShowAddProductModal(false);
    setEditingProductId(null);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProdTitleEn('');
    setProdTitleUr('');
    setProdPrice(4950);
    setProdSalePrice(4200);
    setProdDescEn('');
    setProdDescUr('');
    setProdStock(25);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      value: Number(newCouponVal),
      minOrder: Number(newCouponMin),
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 0,
      isActive: true,
      descriptionEn: `${newCouponVal}${newCouponType === 'percent' ? '%' : ' PKR'} off on min order PKR ${newCouponMin}`,
      descriptionUr: `${newCouponMin} روپے کے آرڈر پر خصوصی رعایت`,
    });
    setNewCouponCode('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.orderStatus === orderStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Admin Header Strip */}
      <div className="bg-[#131622] text-white p-6 rounded-3xl shadow-2xl border border-[#24293c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl font-black font-serif text-white">GA Cloth Executive Console</span>
            <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
              {userRole.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-yellow-400/80 mt-1">
            Store operations, inventory, TCS courier fulfillment, receipt verification, and AI copy generation.
          </p>
        </div>

        {/* Demo role switch buttons */}
        <div className="flex items-center gap-1.5 bg-[#0e111a] p-1.5 rounded-xl border border-[#24293c] text-xs self-start md:self-auto">
          <span className="text-yellow-400 text-[10px] uppercase font-bold pl-1.5">Role:</span>
          {(['super_admin', 'manager', 'support_staff'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setUserRole(r)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer capitalize ${
                userRole === r
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#181d2c]'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Admin Module Navigation Tabs */}
      <div className="flex border-b border-[#24293c] overflow-x-auto pb-1 gap-1.5">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#131622]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {canManageProducts && (
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#131622]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
        )}

        {canManageProducts && (
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#131622]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer relative ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#131622]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          )}
        </button>

        {canManageProducts && (
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#131622]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-[#131622]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews ({reviews.length})</span>
          {pendingReviewsCount > 0 && (
            <span className="text-[10px] bg-yellow-400 text-black px-1.5 rounded-full font-black">
              {pendingReviewsCount}
            </span>
          )}
        </button>

        {canAccessSettings && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#131622]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        )}

        {canAccessStaff && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#131622]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Roles</span>
          </button>
        )}
      </div>

      {/* 3. Tab Contents */}

      {/* A. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-1">
              <span className="text-yellow-400 text-xs uppercase font-bold flex items-center justify-between">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </span>
              <p className="text-2xl font-black text-white">
                PKR {totalSalesPKR.toLocaleString()}
              </p>
              <p className="text-[11px] text-yellow-300 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-yellow-400" />
                <span>+18.4% this week</span>
              </p>
            </div>

            <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-1">
              <span className="text-yellow-400 text-xs uppercase font-bold flex items-center justify-between">
                <span>Orders Count</span>
                <ShoppingBag className="w-4 h-4 text-yellow-400" />
              </span>
              <p className="text-2xl font-black text-white">{orders.length}</p>
              <p className="text-[11px] text-yellow-300 font-semibold">
                {pendingOrdersCount} pending fulfillment
              </p>
            </div>

            <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-1">
              <span className="text-yellow-400 text-xs uppercase font-bold flex items-center justify-between">
                <span>Low Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </span>
              <p className="text-2xl font-black text-white">{lowStockCount}</p>
              <p className="text-[11px] text-rose-400 font-semibold">Items below 10 units</p>
            </div>

            <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-1">
              <span className="text-yellow-400 text-xs uppercase font-bold flex items-center justify-between">
                <span>Customer Reviews</span>
                <MessageSquare className="w-4 h-4 text-yellow-400" />
              </span>
              <p className="text-2xl font-black text-white">{reviews.length}</p>
              <p className="text-[11px] text-yellow-300 font-semibold">
                {reviews.filter((r) => r.status === 'approved').length} approved public
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions (1 col) */}
            <div className="bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-3">
              <h3 className="font-bold text-sm text-white">Staff Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => openAddProductModal()}
                  className="w-full p-3 bg-[#181d2c] hover:bg-[#20263a] border border-[#2b3145] rounded-xl text-left text-xs font-bold text-white flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-yellow-400" />
                    <span>Add New Luxury Suit</span>
                  </span>
                  <span className="text-[10px] text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">AI Copy</span>
                </button>

                <button
                  onClick={() => {
                    setOrderStatusFilter('placed');
                    setActiveTab('orders');
                  }}
                  className="w-full p-3 bg-[#181d2c] hover:bg-[#20263a] border border-[#2b3145] rounded-xl text-left text-xs font-bold text-white flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-yellow-400" />
                    <span>Verify Bank / JazzCash Receipts</span>
                  </span>
                  <span className="text-[10px] font-bold text-yellow-300 bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-500/30">
                    {orders.filter((o) => o.paymentStatus === 'pending').length} Unverified
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('inventory');
                  }}
                  className="w-full p-3 bg-[#181d2c] hover:bg-[#20263a] border border-[#2b3145] rounded-xl text-left text-xs font-bold text-white flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-yellow-400" />
                    <span>Update Warehouse Stock</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Audit Log</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview (2 cols) */}
            <div className="lg:col-span-2 bg-[#131622] p-5 rounded-2xl border border-[#24293c] shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-yellow-400 font-bold hover:underline hover:text-yellow-300 cursor-pointer"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto border border-[#24293c] rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] border-b border-[#24293c]">
                    <tr>
                      <th className="p-2.5">Order</th>
                      <th className="p-2.5">Customer</th>
                      <th className="p-2.5">Payment</th>
                      <th className="p-2.5">Total</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2335]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-[#181d2c]/60">
                        <td className="p-2.5 font-mono font-bold text-white">{o.id}</td>
                        <td className="p-2.5 font-semibold text-slate-200">{o.customerName}</td>
                        <td className="p-2.5 uppercase font-medium text-slate-300">
                          {o.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="p-2.5 font-black text-yellow-400">
                          PKR {o.total.toLocaleString()}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#181d2c] text-yellow-300 border border-yellow-400/30">
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. Products Catalog Management */}
      {activeTab === 'products' && canManageProducts && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white font-serif">Product Catalog Manager</h2>
              <p className="text-xs text-yellow-400/80">
                Manage physical lawn, festive formals, pret suits, sizes, variants, and pricing.
              </p>
            </div>

            <button
              onClick={() => openAddProductModal()}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product (with AI Copy)</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-[#24293c] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#24293c]">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Pieces</th>
                  <th className="p-3">Fabric</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2335]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#181d2c]/60 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.titleEn}
                          className="w-10 h-12 object-cover rounded-md border border-[#24293c]"
                        />
                        <div>
                          <p className="font-bold text-white">{p.titleEn}</p>
                          <p className="text-[10px] font-urdu text-yellow-400/90">{p.titleUr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-950/60 text-yellow-300 border border-yellow-500/30">
                        {p.pieceCount || '3-Piece'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-300">{p.fabric}</td>
                    <td className="p-3">
                      <span className="font-bold text-yellow-400">
                        PKR {(p.salePrice || p.price).toLocaleString()}
                      </span>
                      {p.salePrice && (
                        <span className="block text-[10px] text-slate-500 line-through">
                          PKR {p.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold">
                      <span className={p.totalStock < 10 ? 'text-rose-400' : 'text-slate-200'}>
                        {p.totalStock} units
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAddProductModal(p)}
                          className="p-1.5 text-yellow-400 hover:text-white hover:bg-[#181d2c] rounded-lg cursor-pointer transition"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg cursor-pointer transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* C. Inventory Warehouse Manager */}
      {activeTab === 'inventory' && canManageProducts && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white font-serif">
                Warehouse Stock & Inventory Adjustment
              </h2>
              <p className="text-xs text-yellow-400/80">
                Live inventory tracking with quick increment/decrement and low stock warnings.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/30">
              {lowStockCount} Items Low Stock (&lt;10)
            </span>
          </div>

          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-[#24293c] bg-[#181d2c] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.titleEn}
                    className="w-12 h-14 object-cover rounded-lg border border-[#24293c]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{p.titleEn}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Fabric: {p.fabric} • Category: {p.subcategory}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                        p.totalStock < 10
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      Total In Stock: {p.totalStock} units
                    </span>
                  </div>
                </div>

                {/* Variants adjustment pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {p.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 bg-[#0e111a] px-2.5 py-1.5 rounded-xl border border-[#2b3145] text-xs shadow-md"
                    >
                      <span className="font-medium text-slate-300">{v.size}:</span>
                      <span className="font-mono font-bold text-yellow-400">{v.stock}</span>
                      <div className="flex items-center gap-1 pl-1">
                        <button
                          onClick={() => adjustStock(p.id, v.id, -1)}
                          disabled={v.stock <= 0}
                          className="w-5 h-5 bg-[#181d2c] hover:bg-[#20263a] text-white rounded flex items-center justify-center font-bold disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, v.id, 5)}
                          className="px-1.5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 rounded flex items-center justify-center text-[10px] font-black cursor-pointer shadow-xs"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. Orders & Shipping Management */}
      {activeTab === 'orders' && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white font-serif">
                Orders & TCS Logistics Fulfillment
              </h2>
              <p className="text-xs text-yellow-400/80">
                Verify JazzCash / Bank transfer receipts, update status timeline, and assign TCS consignment #.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 bg-[#0e111a] p-1.5 rounded-xl border border-[#24293c] text-xs">
              {['all', 'placed', 'confirmed', 'packed', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-[#24293c] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#24293c]">
                <tr>
                  <th className="p-3">Order Details</th>
                  <th className="p-3">Customer & City</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">TCS Tracking</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2335]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#181d2c]/60 transition">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 block">{ord.date}</span>
                      <span className="text-xs font-black text-yellow-400">
                        PKR {ord.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-white">{ord.customerName}</p>
                      <p className="text-[11px] text-yellow-300 font-mono">{ord.customerPhone}</p>
                      <p className="text-[11px] text-slate-300">
                        {ord.shippingCity}, {ord.shippingProvince}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-medium block text-slate-200">
                        {ord.paymentMethod.replace('_', ' ')}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                          ord.paymentStatus === 'verified' || ord.paymentStatus === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-yellow-950/60 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                      {ord.paymentProofUrl && (
                        <button
                          onClick={() => setSelectedProofOrder(ord)}
                          className="text-[10px] text-yellow-400 block hover:underline font-bold mt-1 cursor-pointer"
                        >
                          View Receipt Screenshot ↗
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {ord.tcsTrackingNumber ? (
                        <span className="font-mono font-bold text-yellow-400 bg-[#181d2c] px-2.5 py-1 rounded border border-yellow-400/30">
                          {ord.tcsTrackingNumber}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOrderForTcs(ord.id);
                            setTcsInput(`TCS-${Math.floor(10000000 + Math.random() * 90000000)}PK`);
                          }}
                          className="text-[11px] text-yellow-400 font-bold hover:underline cursor-pointer"
                        >
                          + Assign TCS #
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#181d2c] border border-[#2b3145] rounded-lg p-1.5 text-xs font-bold text-white cursor-pointer focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ord.paymentStatus === 'pending' && (
                          <button
                            onClick={() => verifyOrderPayment(ord.id, 'verified')}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-lg text-[10px] font-black transition cursor-pointer shadow-xs"
                            title="Verify and Approve Payment"
                          >
                            Verify Pay
                          </button>
                        )}
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="p-1.5 text-yellow-400 hover:text-white hover:bg-[#181d2c] rounded-lg transition cursor-pointer"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E. Coupons Management */}
      {activeTab === 'coupons' && canManageProducts && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white font-serif">Promo Coupons & Vouchers</h2>
              <p className="text-xs text-yellow-400/80">
                Create percentage or flat PKR discount codes with minimum order constraints.
              </p>
            </div>
          </div>

          {/* New Coupon Box */}
          <form
            onSubmit={handleCreateCoupon}
            className="p-4 rounded-2xl bg-[#0e111a] border border-[#24293c] grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div>
              <label className="text-[11px] font-bold block mb-1 text-yellow-400">Coupon Code</label>
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder="e.g. EID20"
                className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs uppercase font-mono font-bold focus:ring-1 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1 text-yellow-400">Discount Value</label>
              <input
                type="number"
                required
                value={newCouponVal}
                onChange={(e) => setNewCouponVal(Number(e.target.value))}
                className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1 text-yellow-400">Type</label>
              <select
                value={newCouponType}
                onChange={(e) => setNewCouponType(e.target.value as any)}
                className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs cursor-pointer focus:ring-1 focus:ring-yellow-400"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Flat PKR</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1 text-yellow-400">Min Order (PKR)</label>
              <input
                type="number"
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs focus:ring-1 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-lg text-xs font-black transition cursor-pointer shadow-md"
            >
              Add Coupon
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="p-4 rounded-2xl border border-[#24293c] bg-[#181d2c] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-yellow-400 bg-[#0e111a] px-2.5 py-0.5 rounded border border-yellow-400/30">
                    {c.code}
                  </span>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-bold text-white">{c.descriptionEn}</p>
                <p className="text-[11px] text-slate-400">
                  Used: <span className="text-yellow-400">{c.usedCount}</span> of {c.usageLimit} times
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. Review Moderation */}
      {activeTab === 'reviews' && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white font-serif">
              Customer Reviews Moderation
            </h2>
            <p className="text-xs text-yellow-400/80">
              Only approve genuine feedback from verified Pakistani purchasers before it renders publicly.
            </p>
          </div>

          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl border border-[#24293c] bg-[#181d2c] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{r.customerName}</span>
                    <span className="text-[10px] text-yellow-400">({r.customerCity || 'Lahore'})</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        r.status === 'approved'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : r.status === 'pending'
                          ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-500/30'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{r.comment}"</p>
                  <p className="text-[10px] text-slate-400">Product: <span className="text-yellow-400">{r.productTitle}</span> • Date: {r.date}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => moderateReview(r.id, 'approved')}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => moderateReview(r.id, 'rejected')}
                      className="px-3 py-1.5 bg-[#24293c] hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 border border-[#2b3145] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* G. Store Settings (Super Admin Only) */}
      {activeTab === 'settings' && canAccessSettings && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white font-serif">Store & Payment Settings</h2>
            <p className="text-xs text-yellow-400/80">
              Configure free shipping threshold, Bank, JazzCash, Easypaisa, and COD settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Logistics */}
            <div className="p-5 rounded-2xl bg-[#0e111a] border border-[#24293c] space-y-3">
              <h4 className="font-bold text-sm text-yellow-400">TCS Courier Shipping Rules</h4>
              <div>
                <label className="font-bold block mb-1 text-slate-300">Standard Flat Shipping Fee (PKR)</label>
                <input
                  type="number"
                  value={storeSettings.standardShippingFee}
                  onChange={(e) =>
                    updateStoreSettings({ standardShippingFee: Number(e.target.value) })
                  }
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 font-bold focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-300">Free Shipping Threshold (PKR)</label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) =>
                    updateStoreSettings({ freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 font-bold focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-yellow-300">
                  <input
                    type="checkbox"
                    checked={storeSettings.codEnabled}
                    onChange={(e) => updateStoreSettings({ codEnabled: e.target.checked })}
                    className="rounded accent-yellow-400"
                  />
                  <span>Enable Cash on Delivery (COD) for physical items</span>
                </label>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="p-5 rounded-2xl bg-[#0e111a] border border-[#24293c] space-y-3">
              <h4 className="font-bold text-sm text-yellow-400">Pakistan Payment Accounts</h4>
              <div>
                <label className="font-bold block mb-1 text-slate-300">Meezan Bank Account Title</label>
                <input
                  type="text"
                  value={storeSettings.bankDetails.accountTitle}
                  onChange={(e) =>
                    updateStoreSettings({
                      bankDetails: { ...storeSettings.bankDetails, accountTitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1 text-slate-300">JazzCash Account</label>
                  <input
                    type="text"
                    value={storeSettings.jazzCashDetails.accountNumber}
                    onChange={(e) =>
                      updateStoreSettings({
                        jazzCashDetails: {
                          ...storeSettings.jazzCashDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 font-mono focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-slate-300">Easypaisa Account</label>
                  <input
                    type="text"
                    value={storeSettings.easypaisaDetails.accountNumber}
                    onChange={(e) =>
                      updateStoreSettings({
                        easypaisaDetails: {
                          ...storeSettings.easypaisaDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 font-mono focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* H. Staff & Roles (Super Admin Only) */}
      {activeTab === 'staff' && canAccessStaff && (
        <div className="bg-[#131622] p-6 rounded-3xl border border-[#24293c] shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white font-serif">Staff Roles & Permissions</h2>
            <p className="text-xs text-yellow-400/80">
              Multi-role administration: Super Admin (all access), Store Manager, and Support Staff.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Tariq Mehmood (You)', email: 'tariq@gacloth.pk', role: 'Super Admin', status: 'Active' },
              { name: 'Saima Khan', email: 'saima@gacloth.pk', role: 'Store Manager', status: 'Active' },
              { name: 'Hamza Bilal', email: 'hamza@gacloth.pk', role: 'Support Staff', status: 'Active' },
            ].map((staff, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-[#24293c] bg-[#181d2c] flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{staff.name}</p>
                  <p className="text-[11px] text-slate-400">{staff.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-yellow-300 bg-yellow-400/20 px-2.5 py-1 rounded-lg border border-yellow-400/30">
                    {staff.role}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Product with Gemini AI Copywriter */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e111a] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#262c40] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#24293c] bg-[#131622] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white font-serif">
                  {editingProductId ? 'Edit Product' : 'Add New Product to GA Cloth'}
                </h3>
                <p className="text-xs text-yellow-400/80">
                  Includes Gemini 4 High-Thinking automated English & Urdu luxury copywriting.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#181d2c] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* AI Generator Helper Bar */}
              <div className="p-4 rounded-2xl bg-[#181d2c] border border-yellow-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Gemini 4 Argon AI Copywriter (High Thinking)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:bg-[#24293c] disabled:text-slate-500 text-black rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-black" />
                    <span>{isAiGenerating ? 'Thinking & Writing...' : 'Generate EN + UR Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-yellow-300/80">
                  Fills title, luxury description, Urdu translation, features, and SEO tags automatically based on fabric and embroidery.
                </p>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-yellow-400 block mb-1">English Title *</label>
                  <input
                    type="text"
                    required
                    value={prodTitleEn}
                    onChange={(e) => setProdTitleEn(e.target.value)}
                    placeholder="e.g. Meena Embroidered Chiffon 3-Piece"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Urdu Title (اردو نام)</label>
                  <input
                    type="text"
                    value={prodTitleUr}
                    onChange={(e) => setProdTitleUr(e.target.value)}
                    placeholder="مثال: مینا کڑھائی دار شفون ۳ پیس"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-urdu text-right focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Category, Type & Pieces */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer focus:ring-1 focus:ring-yellow-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#181d2c] text-white">
                        {c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Piece Count</label>
                  <select
                    value={prodPieces}
                    onChange={(e) => setProdPieces(e.target.value as any)}
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer focus:ring-1 focus:ring-yellow-400"
                  >
                    <option value="1-Piece" className="bg-[#181d2c] text-white">1-Piece (Kurti / Shirt)</option>
                    <option value="2-Piece" className="bg-[#181d2c] text-white">2-Piece (Shirt + Trouser/Dupatta)</option>
                    <option value="3-Piece" className="bg-[#181d2c] text-white">3-Piece (Complete Luxury Suit)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Fabric</label>
                  <select
                    value={prodFabric}
                    onChange={(e) => setProdFabric(e.target.value)}
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 cursor-pointer focus:ring-1 focus:ring-yellow-400"
                  >
                    <option value="Lawn" className="bg-[#181d2c] text-white">Egyptian Lawn</option>
                    <option value="Chiffon" className="bg-[#181d2c] text-white">Pure Chiffon</option>
                    <option value="Cotton" className="bg-[#181d2c] text-white">Combed Cotton / Latha</option>
                    <option value="Jacquard" className="bg-[#181d2c] text-white">Zari Jacquard</option>
                    <option value="Velvet" className="bg-[#181d2c] text-white">Micro Velvet</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Retail Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={prodSalePrice || ''}
                    onChange={(e) =>
                      setProdSalePrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Leave empty if regular"
                    className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl p-2.5 font-bold text-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-yellow-400 block mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="font-bold text-yellow-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-mono text-[11px] focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* Descriptions */}
              <div>
                <label className="font-bold text-yellow-400 block mb-1">
                  English Luxury Fashion Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescEn}
                  onChange={(e) => setProdDescEn(e.target.value)}
                  placeholder="Fabric composition, drape, embroidery details, styling recommendation..."
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="font-bold text-yellow-400 block mb-1">
                  Urdu Description (اردو میں تفصیل)
                </label>
                <textarea
                  rows={2}
                  value={prodDescUr}
                  onChange={(e) => setProdDescUr(e.target.value)}
                  placeholder="کپڑے کا معیار، کڑھائی اور سلائی کی خصوصیات..."
                  className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 font-urdu text-right focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-[#24293c] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 bg-[#181d2c] text-slate-300 hover:text-white rounded-xl font-bold cursor-pointer transition border border-[#2b3145]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl font-black cursor-pointer transition shadow-md"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign TCS Tracking Consignment */}
      {selectedOrderForTcs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e111a] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#262c40] space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-yellow-400" />
              <span>Assign TCS Consignment Tracking Number</span>
            </h3>

            <p className="text-xs text-slate-300">
              Enter the official tracking number issued by TCS Courier dispatch counter:
            </p>

            <input
              type="text"
              value={tcsInput}
              onChange={(e) => setTcsInput(e.target.value)}
              placeholder="e.g. TCS-92837412PK"
              className="w-full p-2.5 bg-[#181d2c] border border-[#2b3145] text-white rounded-xl font-mono font-bold text-xs focus:ring-1 focus:ring-yellow-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForTcs(null)}
                className="px-4 py-2 bg-[#181d2c] border border-[#2b3145] rounded-xl text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tcsInput.trim()) {
                    assignTcsTracking(selectedOrderForTcs, tcsInput.trim());
                    updateOrderStatus(
                      selectedOrderForTcs,
                      'shipped',
                      `Dispatched via TCS Courier consignment #${tcsInput.trim()}`,
                      `ٹی سی ایس ایکسپریس کے حوالے کر دیا گیا، کنسائنمنٹ نمبر #${tcsInput.trim()}`
                    );
                    setSelectedOrderForTcs(null);
                  }
                }}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black transition cursor-pointer shadow-md"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Payment Receipt Screenshot */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e111a] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#262c40] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#24293c]">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Payment Receipt Verification - {selectedProofOrder.id}
                </h3>
                <p className="text-xs text-yellow-400">
                  Customer: {selectedProofOrder.customerName} ({selectedProofOrder.customerPhone})
                </p>
              </div>
              <button onClick={() => setSelectedProofOrder(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="p-2 bg-[#181d2c] border border-[#2b3145] rounded-xl text-center">
              <img
                src={selectedProofOrder.paymentProofUrl}
                alt="Payment receipt"
                className="max-h-80 mx-auto rounded-lg object-contain shadow-xs"
              />
            </div>

            <div className="text-xs space-y-1 bg-[#131622] p-3 rounded-xl border border-[#24293c]">
              <p className="text-slate-300">Payment Mode: <strong className="uppercase text-white">{selectedProofOrder.paymentMethod}</strong></p>
              <p className="text-slate-300">Reference: <strong className="font-mono text-yellow-400">{selectedProofOrder.paymentReferenceNumber || 'N/A'}</strong></p>
              <p className="text-slate-300">Amount to verify: <strong className="text-yellow-400 font-bold">PKR {selectedProofOrder.total.toLocaleString()}</strong></p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  verifyOrderPayment(selectedProofOrder.id, 'verified');
                  setSelectedProofOrder(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black transition cursor-pointer shadow-md"
              >
                Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
