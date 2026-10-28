import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Ruler,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    setCurrentView,
    setIsSizeGuideOpen,
    addReview,
    reviews,
    t,
    language,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'features' | 'reviews'>('desc');

  // Review Form State
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerCity, setNewReviewerCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-white">Product not found.</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-yellow-400 text-black font-black rounded-xl text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 4;

  const currentPrice = selectedVariant?.priceOverride || product.salePrice || product.price;
  const originalPrice = product.price;
  const discountPercent =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    if (selectedVariant && !isOutOfStock) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant && !isOutOfStock) {
      addToCart(product, selectedVariant, quantity);
      setCurrentView('checkout');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newReviewComment) return;

    addReview({
      productId: product.id,
      productTitle: product.titleEn,
      customerName: newReviewerName,
      customerCity: newReviewerCity || 'Lahore',
      rating: newReviewRating,
      comment: newReviewComment,
      isVerifiedBuyer: true,
    });

    setNewReviewerName('');
    setNewReviewerCity('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <button onClick={() => setCurrentView('home')} className="hover:text-yellow-400">
          {t.home}
        </button>
        <span>/</span>
        <button onClick={() => setCurrentView('shop')} className="hover:text-yellow-400">
          {t.shop}
        </button>
        <span>/</span>
        <span className="font-semibold text-yellow-400 truncate max-w-xs">
          {language === 'ur' ? product.titleUr : product.titleEn}
        </span>
      </nav>

      {/* 2. Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] bg-[#0c0e14] rounded-3xl overflow-hidden border border-[#24293b] shadow-xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.titleEn}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-md">
                  {t.offBadge.replace('{percent}', discountPercent.toString())}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-yellow-400 ring-2 ring-yellow-400/40'
                      : 'border-[#262c3e] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Fabric Pill & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-[#181d2c] border border-yellow-500/20 text-yellow-300 font-bold uppercase tracking-wider">
                {product.fabric} • {product.pieceCount}
              </span>

              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.rating}</span>
                <span className="text-slate-400 text-xs">({productReviews.length} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug font-serif">
              {language === 'ur' ? product.titleUr : product.titleEn}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                PKR {currentPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="text-base text-slate-400 line-through">
                  PKR {originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Save PKR {(originalPrice - currentPrice).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              Inclusive of all Pakistan government sales taxes. Free TCS delivery over PKR 3,500.
            </p>
          </div>

          {/* Color Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#22273a]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-yellow-400">
                  {t.selectColor} <span className="text-white">({selectedVariant.color})</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      selectedVariantId === variant.id
                        ? 'border-yellow-400 bg-[#1e2338] text-yellow-300 ring-1 ring-yellow-400'
                        : 'border-[#262c40] bg-[#121520] text-slate-300 hover:border-[#3a4260]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-600"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                    <span>{variant.color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector & Size Guide Trigger */}
          <div className="space-y-2 pt-2 border-t border-[#22273a]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-yellow-400">
                {t.selectSize} <span className="text-white">({selectedVariant.size})</span>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-yellow-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{t.sizeGuide}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={variant.stock <= 0}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedVariantId === variant.id
                      ? 'bg-yellow-400 text-black font-black shadow-md'
                      : variant.stock <= 0
                      ? 'bg-[#181b26] text-slate-500 line-through cursor-not-allowed border border-[#22273a]'
                      : 'bg-[#131622] border border-[#2b3145] text-slate-200 hover:border-yellow-400/50'
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status Pill */}
          <div>
            {isOutOfStock ? (
              <span className="inline-block px-3 py-1 bg-black/80 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-bold">
                {t.outOfStock}
              </span>
            ) : isLowStock ? (
              <span className="inline-block px-3 py-1 bg-rose-950/80 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold animate-pulse">
                {t.onlyLeft.replace('{count}', selectedVariant.stock.toString())}
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
                ✓ {t.inStock} ({selectedVariant.stock} items available)
              </span>
            )}
          </div>

          {/* Quantity & Buy Buttons */}
          <div className="space-y-3 pt-3 border-t border-[#22273a]">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#2b3145] rounded-xl overflow-hidden bg-[#131622]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[#1c2132] text-slate-300 transition"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-[#1c2132] text-slate-300 transition"
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 bg-[#161a28] border-2 border-yellow-400/50 hover:bg-yellow-400 hover:text-black text-yellow-400 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
            </div>

            {/* Buy Now / 1-Click Instant Checkout */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl transition disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black/20" />
              <span>{t.buyNow}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#22273a] text-slate-300 text-[11px]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>TCS 2-4 Days Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>7 Days Easy Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>Cash on Delivery & Card</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs: Description, Features, Care, Reviews */}
      <div className="bg-[#131622] rounded-3xl border border-[#24293b] overflow-hidden shadow-md">
        <div className="flex border-b border-[#22273a] bg-[#0c0e14] px-6 pt-3">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'desc'
                ? 'border-yellow-400 text-yellow-400 bg-[#131622] rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.description}
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'features'
                ? 'border-yellow-400 text-yellow-400 bg-[#131622] rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.specifications} & {t.washCare}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-yellow-400 text-yellow-400 bg-[#131622] rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.customerReviews} ({productReviews.length})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p>{language === 'ur' ? product.descriptionUr : product.descriptionEn}</p>
              {language === 'en' && product.descriptionUr && (
                <div className="mt-4 p-4 bg-[#181d2c] rounded-xl border border-[#262c40] font-urdu text-right text-white">
                  <span className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">
                    اردو تفصیل:
                  </span>
                  <p>{product.descriptionUr}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-yellow-400 uppercase tracking-wider mb-3">
                  Key Specifications
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {product.features?.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span>Fabric Composition: {product.fabric}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span>Ensemble: {product.pieceCount} Complete Set</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-yellow-400 uppercase tracking-wider mb-3">
                  {t.washCare}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {language === 'ur' ? product.washCareUr : product.washCareEn}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#22273a]">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    Verified Customer Feedback
                  </h3>
                  <p className="text-xs text-slate-400">
                    Only authentic buyers with verified orders can leave feedback.
                  </p>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-black transition cursor-pointer"
                >
                  {showReviewForm ? 'Cancel' : t.writeReview}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 rounded-2xl bg-[#0e111a] border border-[#262c40] space-y-4 max-w-xl animate-in fade-in"
                >
                  <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                    Write Your Experience
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        required
                        placeholder="e.g. Fatima Ali"
                        className="w-full bg-[#181d2c] border border-[#2b3145] rounded-lg p-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Your City</label>
                      <input
                        type="text"
                        value={newReviewerCity}
                        onChange={(e) => setNewReviewerCity(e.target.value)}
                        placeholder="e.g. Karachi / Islamabad"
                        className="w-full bg-[#181d2c] border border-[#2b3145] rounded-lg p-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Review Comments</label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                      placeholder="Comment on the fabric quality, color accuracy, stitching or TCS shipping..."
                      className="w-full bg-[#181d2c] border border-[#2b3145] rounded-lg p-2 text-xs text-white placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-md"
                  >
                    Submit Review for Verification
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">
                    Be the first verified Pakistani shopper to review this {product.fabric} piece!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-[#24293b] bg-[#161a28] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{rev.customerName}</span>
                          {rev.customerCity && (
                            <span className="text-[10px] text-yellow-400 font-medium">({rev.customerCity})</span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.2 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>

                      <div className="flex text-yellow-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Ensembles */}
      {relatedProducts.length > 0 && (
        <div className="pt-6">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-6 font-serif">
            {t.relatedProducts}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
