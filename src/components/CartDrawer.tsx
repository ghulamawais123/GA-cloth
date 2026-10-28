import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    storeSettings,
    setCurrentView,
    t,
    language,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = storeSettings.freeShippingThreshold;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div
        className={`fixed inset-y-0 ${
          language === 'ur' ? 'left-0' : 'right-0'
        } max-w-full w-full sm:w-[460px] bg-[#0e111a] border-l border-[#24293c] shadow-2xl flex flex-col z-50 animate-in ${
          language === 'ur' ? 'slide-in-from-left' : 'slide-in-from-right'
        } duration-300 text-white`}
      >
        {/* 1. Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2435] flex items-center justify-between bg-[#080a0f]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {t.yourCart} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1f30] transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Free TCS Delivery Progress Bar */}
        <div className="px-4 sm:px-5 py-3 bg-[#131722] border-b border-[#1f2435]">
          <div className="flex items-center justify-between text-xs font-semibold text-yellow-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-yellow-400" />
              <span>
                {progressToFreeShipping >= 100
                  ? t.freeShippingUnlocked
                  : t.addMoreForFreeShipping.replace('{amount}', amountNeeded.toLocaleString())}
              </span>
            </div>
            <span className="text-[11px] font-bold text-yellow-400">
              {progressToFreeShipping}%
            </span>
          </div>

          <div className="w-full bg-[#1e2334] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* 3. Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                <img
                  src="https://kommodo.ai/i/ncFIInZFc0mdAuIoIGcj"
                  alt={language === 'ur' ? 'خالی شاپنگ بیگ' : 'Empty Shopping Bag'}
                  className="w-full h-full object-contain filter drop-shadow-md"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden w-16 h-16 rounded-2xl bg-yellow-400/10 text-yellow-400 items-center justify-center border border-yellow-500/20">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">{t.emptyCart}</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6">
                {language === 'ur'
                  ? 'آپ نے ابھی تک کوئی لان، پریٹ یا فارمل سوٹ منتخب نہیں کیا۔'
                  : 'Your shopping bag is waiting for exquisite Pakistani lawn, pret, or festive formals.'}
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('shop');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-md"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-[#131622] rounded-xl border border-[#24293b] shadow-md hover:border-yellow-400/30 transition-colors"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.titleEn}
                  className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg border border-[#2a3044] flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {language === 'ur' ? item.product.titleUr : item.product.titleEn}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-400 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
                      <span className="font-medium bg-[#1e2336] text-yellow-300 px-1.5 py-0.5 rounded-sm">
                        {item.selectedVariant.size}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-slate-600"
                          style={{ backgroundColor: item.selectedVariant.colorHex }}
                        />
                        {item.selectedVariant.color}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#2b3145] rounded-lg overflow-hidden bg-[#161a28]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 sm:p-1.5 hover:bg-[#202538] text-slate-300 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 sm:px-3 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 sm:p-1.5 hover:bg-[#202538] text-slate-300 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-yellow-400">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Footer & Checkout Section */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#1f2435] bg-[#080a0f] space-y-3">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/70 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px] block text-emerald-400/80">
                        {language === 'ur' ? appliedCoupon.descriptionUr : appliedCoupon.descriptionEn}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-400 font-bold hover:underline"
                  >
                    {language === 'ur' ? 'ختم کریں' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon (e.g. AZADI15)"
                        className="w-full bg-[#131622] border border-[#2b3145] rounded-xl py-2 px-3 text-xs uppercase font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                      <Tag className="w-3.5 h-3.5 text-yellow-400 absolute top-2.5 right-3 pointer-events-none" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition cursor-pointer"
                    >
                      {t.apply}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-white">PKR {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>{t.discount}</span>
                  <span>- PKR {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="font-semibold text-white">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">
                      FREE (TCS)
                    </span>
                  ) : (
                    `PKR ${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-[#1f2435]">
                <span>{t.total}</span>
                <span className="text-yellow-400">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
