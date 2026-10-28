import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  Globe,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Phone,
  Flame,
  Plus,
} from 'lucide-react';
import { UserRole } from '../types/store';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    t,
    userRole,
    setUserRole,
    cartCount,
    subtotal,
    setIsCartOpen,
    setIsAiModalOpen,
    openAddProductModal,
    products,
    setSelectedProductId,
    storeSettings,
    filters,
    setFilters,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products for instant autocomplete
  const searchResults = filters.searchQuery.trim()
    ? products
        .filter((p) => {
          const q = filters.searchQuery.toLowerCase();
          return (
            p.titleEn.toLowerCase().includes(q) ||
            p.titleUr.includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery.trim()) {
      setCurrentView('shop');
      setSearchOpen(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const roles: { role: UserRole; labelEn: string; labelUr: string }[] = [
    { role: 'super_admin', labelEn: 'Super Admin', labelUr: 'سپر ایڈمن' },
    { role: 'manager', labelEn: 'Store Manager', labelUr: 'اسٹور منیجر' },
    { role: 'support_staff', labelEn: 'Support Staff', labelUr: 'سپورٹ اسٹاف' },
    { role: 'customer', labelEn: 'Registered Customer', labelUr: 'گاہک' },
    { role: 'guest', labelEn: 'Guest Shopper', labelUr: 'مہمان خریدار' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md border-b border-[#1f2436] shadow-xl transition-all">
      {/* 1. Announcement Bar */}
      <div className="bg-[#050608] text-yellow-300 text-xs py-1.5 px-4 border-b border-[#161a27]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Promo Ticker */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
              TCS EXPRESS
            </span>
            <span className="font-semibold text-white tracking-wide">
              {language === 'ur' ? storeSettings.announcementTextUr : storeSettings.announcementTextEn}
            </span>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-4">
            {/* WhatsApp helpline */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs text-yellow-400 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+92 300 1234567</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md hover:bg-white/10 text-white transition-colors text-xs font-semibold cursor-pointer border border-yellow-500/20"
              title="Toggle English / Urdu Language & RTL"
            >
              <Globe className="w-3.5 h-3.5 text-yellow-400" />
              <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
            </button>

            {/* Role Switcher Demo Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#161a28] hover:bg-[#202538] text-[11px] font-medium text-white transition cursor-pointer border border-[#2a3044]"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline text-slate-300">{t.roleSwitcher}</span>
                <span className="font-bold text-yellow-400 capitalize">
                  {userRole.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className={`absolute ${
                    language === 'ur' ? 'left-0' : 'right-0'
                  } mt-1 w-48 bg-[#121520] text-white rounded-lg shadow-2xl border border-[#262c40] py-1.5 z-50`}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-yellow-500 tracking-wider">
                    Select Test Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setUserRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#1a1f30] cursor-pointer ${
                        userRole === r.role ? 'bg-[#1e2438] font-bold text-yellow-400' : 'text-slate-300'
                      }`}
                    >
                      <span>{language === 'ur' ? r.labelUr : r.labelEn}</span>
                      {userRole === r.role && <span className="text-xs text-yellow-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#1a1e2d]"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          {/* Logo Monogram (Mobile Badge / Icon) */}
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-700 flex items-center justify-center text-black font-black shadow-lg group-hover:scale-105 transition-transform relative flex-shrink-0">
            <img
              src="https://kommodo.ai/i/cMb9YGDSatzimf8QiGQi"
              alt={language === 'ur' ? 'جی اے کلوتھ مونوگرام' : 'GA Cloth Monogram'}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-serif font-black text-xl tracking-tighter absolute inset-0 flex items-center justify-center -z-10">
              GA
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                GA CLOTH
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/30">
                Pakistan
              </span>
            </div>
            <p className="text-[10px] text-slate-300 tracking-wider font-medium hidden sm:block">
              {language === 'ur' ? 'پریمیم فیشن اور لان کلیکشن' : 'Luxury Apparel & Lawn Couture'}
            </p>
          </div>
        </div>

        {/* Live Search Bar with Instant Suggestions */}
        <div className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-[#131622] border border-[#262c3e] rounded-full py-2.5 ${
                language === 'ur' ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'
              } text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all`}
            />
            <Search
              className={`w-4 h-4 text-yellow-400 absolute top-3.5 ${
                language === 'ur' ? 'right-4' : 'left-4'
              }`}
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                  setSearchOpen(false);
                }}
                className={`absolute top-3 ${
                  language === 'ur' ? 'left-4' : 'right-4'
                } text-slate-400 hover:text-white text-xs`}
              >
                ✕
              </button>
            )}
          </form>

          {/* Autocomplete Popup */}
          {searchOpen && filters.searchQuery.trim().length > 0 && (
            <div
              className="absolute left-0 right-0 mt-2 bg-[#121520] rounded-xl shadow-2xl border border-[#2a3044] py-2 z-50 max-h-96 overflow-y-auto"
              onMouseLeave={() => setSearchOpen(false)}
            >
              <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-yellow-500 flex items-center justify-between">
                <span>{language === 'ur' ? 'تجاویز' : 'Matching Items'}</span>
                <span className="text-[10px] text-slate-300">
                  {searchResults.length} {language === 'ur' ? 'نتائج' : 'found'}
                </span>
              </div>

              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="px-4 py-2 hover:bg-[#1b2030] flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.titleEn}
                      className="w-10 h-12 object-cover rounded-md border border-[#2f364e]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {language === 'ur' ? product.titleUr : product.titleEn}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#1e2438] text-yellow-300 font-medium">
                          {product.fabric}
                        </span>
                        <span className="text-xs font-bold text-yellow-400">
                          PKR {(product.salePrice || product.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-xs text-slate-300">
                  {language === 'ur'
                    ? 'کوئی مماثل پروڈکٹ نہیں ملی۔ Enter دبائیں تاکہ تمام اسٹور میں تلاش کیا جا سکے۔'
                    : 'No direct match found. Press Enter to search all items.'}
                </div>
              )}

              <div className="p-2 border-t border-[#202538] bg-[#0c0e14] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('shop');
                    setSearchOpen(false);
                  }}
                  className="text-xs font-semibold text-yellow-400 hover:underline"
                >
                  {language === 'ur' ? 'تمام نتائج دیکھیں →' : 'View all search results →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Track Order Shortcut */}
          <button
            onClick={() => setCurrentView('track-order')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentView === 'track-order'
                ? 'bg-yellow-400 text-black font-bold'
                : 'text-slate-200 hover:bg-[#181c2b] hover:text-yellow-400'
            }`}
            title="Track TCS Courier Consignment"
          >
            <Truck className="w-4 h-4 text-yellow-400" />
            <span>{t.trackOrder}</span>
          </button>

          {/* AI Fashion Stylist / Consultant ("Zoya") */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/15 via-amber-500/15 to-yellow-600/15 hover:from-yellow-500/25 hover:to-amber-500/25 border border-yellow-400/40 text-xs font-bold text-yellow-400 transition-all shadow-md cursor-pointer group"
            title="Ask AI Stylist with Gemini High Thinking"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-yellow-400/60 bg-yellow-400/20 flex items-center justify-center flex-shrink-0 relative">
              <img
                src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
                alt={language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform -z-10" />
            </div>
            <span className="hidden md:inline">
              {language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase tracking-tighter">
              Argon
            </span>
          </button>

          {/* Add Product Quick Button */}
          <button
            onClick={() => openAddProductModal()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            title="Add New Product (with AI Copywriter)"
          >
            <Plus className="w-4 h-4 text-emerald-100" />
            <span className="hidden sm:inline">
              {language === 'ur' ? 'نیا پروڈکٹ' : 'Add Product'}
            </span>
          </button>

          {/* Account Icon */}
          <button
            onClick={() => setCurrentView('account')}
            className={`p-2 rounded-lg text-slate-200 hover:bg-[#181c2b] hover:text-yellow-400 transition cursor-pointer relative ${
              currentView === 'account' ? 'bg-[#181c2b] text-yellow-400' : ''
            }`}
            title={t.account}
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Icon with Dynamic Pill */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer relative group"
            title={t.cart}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform fill-black/20" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-black">
              PKR {subtotal.toLocaleString()}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Category & Navigation Menu Bar */}
      <nav className="bg-[#08090d] border-t border-[#1b2030] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1 xl:gap-2 py-1.5">
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'all' }));
                setCurrentView('home');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'home'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.home}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'all' }));
                setCurrentView('shop');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'shop' && filters.category === 'all'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.shop}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-unstitched' }));
                setCurrentView('shop');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'shop' && filters.category === 'cat-unstitched'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.unstitched}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-pret' }));
                setCurrentView('shop');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'shop' && filters.category === 'cat-pret'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.pret}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-festive' }));
                setCurrentView('shop');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'shop' && filters.category === 'cat-festive'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.festive}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-menswear' }));
                setCurrentView('shop');
              }}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                currentView === 'shop' && filters.category === 'cat-menswear'
                  ? 'text-yellow-400 bg-[#161a28] font-bold border border-yellow-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.menswear}
            </button>

            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, inStockOnly: false, category: 'all' }));
                setCurrentView('shop');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-amber-400 hover:bg-amber-500/10 transition cursor-pointer font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{t.flashSale}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Product Button */}
            <button
              onClick={() => openAddProductModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'نیا پروڈکٹ شامل کریں' : '+ Add Product'}</span>
            </button>

            {/* Admin Panel Access Link if Staff */}
            {(userRole === 'super_admin' || userRole === 'manager' || userRole === 'support_staff') && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-[#181c2c] text-yellow-300 hover:bg-[#22273e] border border-yellow-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.adminPanel}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e111a] border-b border-[#24293c] px-4 py-4 space-y-3 animate-in slide-in-from-top">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#161a26] border border-[#2b3145] rounded-lg py-2 px-9 text-xs text-white placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-yellow-400 absolute top-2.5 left-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium pt-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.home}
            </button>
            <button
              onClick={() => {
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.shop}
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-unstitched' }));
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.unstitched}
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-pret' }));
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.pret}
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-festive' }));
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.festive}
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: 'cat-menswear' }));
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg hover:bg-[#1d2233]"
            >
              {t.menswear}
            </button>
            <button
              onClick={() => {
                setCurrentView('track-order');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-yellow-400" />
              {t.trackOrder}
            </button>
            <button
              onClick={() => {
                setCurrentView('account');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left bg-[#151824] text-white hover:text-yellow-400 rounded-lg flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-yellow-400" />
              {t.account}
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                openAddProductModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ur' ? 'نیا پروڈکٹ شامل کریں' : '+ Add New Product'}</span>
            </button>

            {(userRole === 'super_admin' || userRole === 'manager' || userRole === 'support_staff') && (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-yellow-400 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>{t.adminPanel}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
