import React, { useState } from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCurrentView, setSelectedProductId, addToCart, language, t } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;
  const isLowStock = activeVariant && activeVariant.stock > 0 && activeVariant.stock <= 4;

  const currentPrice = activeVariant?.priceOverride || product.salePrice || product.price;
  const originalPrice = product.price;
  const discountPercent =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVariant && activeVariant.stock > 0) {
      addToCart(product, activeVariant, 1);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#131622] rounded-2xl border border-[#24293b] hover:border-yellow-500/40 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* 1. Image & Badges Container */}
      <div className="relative aspect-[3/4] bg-[#0c0e14] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.titleEn}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-md bg-yellow-500 text-black text-[10px] font-black uppercase tracking-wider shadow-sm">
                New Launch
              </span>
            )}

            {/* Flash Deal indicator */}
            {product.isFlashDeal && (
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Zap className="w-3 h-3 fill-black" />
                Flash Deal
              </span>
            )}
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black tracking-wide shadow-sm">
              {t.offBadge.replace('{percent}', discountPercent.toString())}
            </span>
          )}
        </div>

        {/* Stock warning pill */}
        {isOutOfStock ? (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/85 backdrop-blur-xs text-yellow-300 text-center py-1 rounded-md text-[11px] font-bold border border-yellow-500/20">
            {t.outOfStock}
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 left-2.5 bg-rose-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
            {t.onlyLeft.replace('{count}', activeVariant.stock.toString())}
          </div>
        ) : null}

        {/* Quick View Floating Button on Desktop hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="absolute inset-x-4 bottom-4 py-2 bg-black/90 hover:bg-black text-yellow-400 border border-yellow-500/40 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5 hidden md:flex pointer-events-auto"
        >
          <Eye className="w-3.5 h-3.5 text-yellow-400" />
          <span>{t.quickView}</span>
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          {/* Brand Tag & Fabric */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 mb-1">
            <span className="font-mono font-black text-amber-400 tracking-wider uppercase text-[9px] sm:text-[10px]">
              {product.brandLine || 'GA LUXURY'}
            </span>
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
            {language === 'ur' ? product.titleUr : product.titleEn}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="bg-[#1a1e2d] border border-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-300/80 font-medium">
              {product.fabric}
            </span>
            <span className="text-slate-400 font-medium">
              • {product.pieceCount}
            </span>
          </div>
        </div>

        {/* Color swatches & Variant choices */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {product.variants.slice(0, 4).map((variant, index) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantIndex(index)}
                title={`${variant.color} - ${variant.size}`}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedVariantIndex === index
                    ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-[#131622] scale-110'
                    : 'border-slate-600 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: variant.colorHex }}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202538] mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-yellow-400">
                PKR {currentPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] text-slate-400 line-through">
                  PKR {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add icon button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl text-black transition-all shadow-sm cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:scale-95'
            }`}
            title={t.quickAdd}
          >
            <ShoppingBag className="w-3.5 h-3.5 fill-black/20" />
          </button>
        </div>
      </div>
    </div>
  );
};
