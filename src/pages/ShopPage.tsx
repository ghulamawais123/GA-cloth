import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  Plus,
  LayoutGrid,
  Grid,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, filters, setFilters, resetFilters, openAddProductModal, t, language } = useStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridDensity, setGridDensity] = useState<'4' | '3' | '2'>('4');

  const availableFabrics = ['Lawn', 'Chiffon', 'Cotton', 'Jacquard', 'Velvet', 'Silk'];

  const toggleFabric = (fabric: string) => {
    setFilters((prev) => {
      const exists = prev.fabrics.includes(fabric);
      return {
        ...prev,
        fabrics: exists ? prev.fabrics.filter((f) => f !== fabric) : [...prev.fabrics, fabric],
      };
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    // 1. Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        p.titleEn.toLowerCase().includes(q) ||
        p.titleUr.includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Category
    if (filters.category !== 'all' && p.category !== filters.category) {
      return false;
    }

    // 3. Fabric
    if (filters.fabrics.length > 0 && !filters.fabrics.includes(p.fabric)) {
      return false;
    }

    // 4. In stock only
    if (filters.inStockOnly && p.totalStock <= 0) {
      return false;
    }

    // 5. Price range
    const currentPrice = p.salePrice || p.price;
    if (currentPrice < filters.minPrice || currentPrice > filters.maxPrice) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;

    if (filters.sortBy === 'price-low') return priceA - priceB;
    if (filters.sortBy === 'price-high') return priceB - priceA;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return 0; // Newest by default
  });

  return (
    <div className="max-w-[1580px] mx-auto px-3 sm:px-6 py-8">
      {/* 1. Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#22273a]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
            {language === 'ur' ? 'تمام لگژری مصنوعات' : 'GA Cloth Catalog'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {t.showingProducts.replace('{count}', sortedProducts.length.toString())}
            {filters.category !== 'all' && (
              <span className="font-semibold text-yellow-400">
                {' '}• {categories.find((c) => c.id === filters.category)?.nameEn}
              </span>
            )}
            <span className="ml-2 text-yellow-400/90 font-mono text-[11px] bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
              4 Products Per Line Active
            </span>
          </p>
        </div>

        {/* Sorting, Grid Switcher & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Grid Density Switcher (4 cols, 3 cols, 2 cols) */}
          <div className="hidden sm:flex items-center gap-1 bg-[#131622] p-1 rounded-xl border border-[#2b3145]">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Grid:</span>
            <button
              onClick={() => setGridDensity('4')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                gridDensity === '4'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="4 Products Per Line"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>4 Cols</span>
            </button>
            <button
              onClick={() => setGridDensity('3')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                gridDensity === '3'
                  ? 'bg-yellow-400 text-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="3 Products Per Line"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>3 Cols</span>
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => openAddProductModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-100" />
            <span>{language === 'ur' ? 'نیا پروڈکٹ شامل کریں' : '+ Add Product'}</span>
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#131622] border border-[#2b3145] rounded-xl text-xs font-bold text-yellow-400 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
            <span>{t.filterBy}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-[#131622] border border-[#2b3145] rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">{t.sortBy}</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="bg-[#131622] font-bold text-yellow-400 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-[#131622] text-white">{t.sortNewest}</option>
              <option value="price-low" className="bg-[#131622] text-white">{t.sortPriceLowHigh}</option>
              <option value="price-high" className="bg-[#131622] text-white">{t.sortPriceHighLow}</option>
              <option value="rating" className="bg-[#131622] text-white">{t.sortRating}</option>
            </select>
          </div>

          {/* Clear Filters (if active) */}
          {(filters.category !== 'all' ||
            filters.fabrics.length > 0 ||
            filters.inStockOnly ||
            filters.searchQuery) && (
            <button
              onClick={resetFilters}
              className="p-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.clearFilters}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Layout (Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-[#131622] p-5 rounded-2xl border border-[#24293b] shadow-md sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#202538]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-yellow-400" />
              <span>{t.filterBy}</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-yellow-400 font-semibold hover:underline cursor-pointer"
            >
              {language === 'ur' ? 'ری سیٹ' : 'Reset'}
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">
              {t.category}
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  filters.category === 'all'
                    ? 'bg-yellow-400 text-black font-black'
                    : 'text-slate-300 hover:bg-[#1a1f30] hover:text-white'
                }`}
              >
                {language === 'ur' ? 'تمام کیٹیگریز' : 'All Categories'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    filters.category === cat.id
                      ? 'bg-yellow-400 text-black font-black'
                      : 'text-slate-300 hover:bg-[#1a1f30] hover:text-white'
                  }`}
                >
                  {language === 'ur' ? cat.nameUr : cat.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Type */}
          <div className="pt-2 border-t border-[#202538]">
            <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">
              {t.fabric}
            </h4>
            <div className="space-y-1.5">
              {availableFabrics.map((fabric) => {
                const checked = filters.fabrics.includes(fabric);
                return (
                  <label
                    key={fabric}
                    className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFabric(fabric)}
                      className="rounded border-[#343b52] text-yellow-400 focus:ring-yellow-400 h-3.5 w-3.5 accent-yellow-400"
                    />
                    <span>{fabric}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-[#202538]">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none hover:text-white">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="rounded border-[#343b52] text-yellow-400 focus:ring-yellow-400 h-3.5 w-3.5 accent-yellow-400"
              />
              <span className="font-semibold text-white">In-Stock Only</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="pt-2 border-t border-[#202538]">
            <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">
              {t.priceRange}
            </h4>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>PKR {filters.minPrice}</span>
              <span className="font-bold text-yellow-400">PKR {filters.maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full accent-yellow-400 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid Area (Default 4 columns per line) */}
        <div className="flex-1 min-w-0 w-full">
          {sortedProducts.length === 0 ? (
            <div className="bg-[#131622] rounded-2xl border border-[#24293b] p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 text-yellow-400 mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'ur' ? 'کوئی پروڈکٹ نہیں ملی' : 'No matching items found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                {language === 'ur'
                  ? 'برائے مہربانی اپنے فلٹرز یا تلاش کے الفاظ کو تبدیل کریں۔'
                  : 'Try adjusting your filters or search keywords to find what you are looking for.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div
              className={`grid ${
                gridDensity === '4'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'
                  : gridDensity === '3'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              } gap-3.5 sm:gap-4`}
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 max-w-full w-80 bg-[#121520] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#262c40]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#202538]">
                <h3 className="font-bold text-sm text-white">{t.filterBy}</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase">{t.category}</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: 'all' }));
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded ${
                      filters.category === 'all' ? 'bg-yellow-400 text-black font-black' : 'text-slate-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                      className={`w-full text-left px-2 py-1.5 rounded ${
                        filters.category === cat.id ? 'bg-yellow-400 text-black font-black' : 'text-slate-300'
                      }`}
                    >
                      {language === 'ur' ? cat.nameUr : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabrics */}
              <div>
                <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase">{t.fabric}</h4>
                <div className="space-y-1.5">
                  {availableFabrics.map((fabric) => (
                    <label key={fabric} className="flex items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={filters.fabrics.includes(fabric)}
                        onChange={() => toggleFabric(fabric)}
                        className="rounded accent-yellow-400"
                      />
                      <span>{fabric}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#202538]">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black rounded-xl text-xs cursor-pointer shadow-md"
              >
                Apply Filters ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
