import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '../data/initialData';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Banknote,
  ArrowRight,
  Lock,
  FileCheck,
} from 'lucide-react';
import { PaymentMethod } from '../types/store';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    storeSettings,
    placeOrder,
    setCurrentView,
    t,
    language,
    showToast,
  } = useStore();

  // Customer Contact State
  const [fullName, setFullName] = useState('Ayesha Khan');
  const [phone, setPhone] = useState('03001234567');
  const [email, setEmail] = useState('ayesha.k@example.com');

  // Shipping Address State - Always mandatory
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('House 18-A, Street 4, Phase 5, DHA');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [trxRefNumber, setTrxRefNumber] = useState('');
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // 3DS OTP modal simulation for Card
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock receipt upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofImage(reader.result as string);
        showToast(language === 'ur' ? 'رسید کامیابی سے منسلک ہو گئی۔' : 'Payment receipt uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const executeOrderCreation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        shippingProvince: province,
        shippingCity: city,
        shippingAddress: address,
        deliveryNotes,
        paymentMethod,
        paymentReferenceNumber: trxRefNumber || (paymentMethod === 'card' ? `CARD-AUTH-${Date.now().toString().slice(-6)}` : undefined),
        paymentProofUrl: paymentProofImage || undefined,
        notes: 'Handcrafted luxury apparel parcel - TCS express dispatch',
      });

      setIsSubmitting(false);
      setShowOtpModal(false);
      setCurrentView('order-confirmation');
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast(language === 'ur' ? 'آپ کا شاپنگ بیگ خالی ہے!' : 'Your cart is empty!');
      setCurrentView('shop');
      return;
    }

    if (!address.trim()) {
      showToast(language === 'ur' ? 'برائے مہربانی اپنا مکمل پتہ درج کریں۔' : 'Please provide complete delivery street address.');
      return;
    }

    if (paymentMethod === 'card') {
      setShowOtpModal(true);
      return;
    }

    if (paymentMethod === 'bank_transfer' && !trxRefNumber && !paymentProofImage) {
      showToast(
        language === 'ur'
          ? 'برائے مہربانی ٹرانزیکشن ریفرنس نمبر یا رسید اپلوڈ کریں۔'
          : 'Please enter transaction reference ID or upload payment receipt.'
      );
      return;
    }

    executeOrderCreation();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
          {t.checkoutTitle}
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          {language === 'ur'
            ? 'محفوظ چیک آؤٹ • پاکستان بھر میں تیز ترین TCS ایکسپریس ڈلیوری'
            : 'Encrypted checkout • Fast nationwide TCS express delivery'}
        </p>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Contact, Shipping, Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-[#131622] p-5 sm:p-6 rounded-2xl border border-[#24293b] shadow-md space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs">
                  1
                </span>
                <span>{t.contactInfo}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-yellow-400 block mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-yellow-400 block mb-1">{t.phone} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs font-mono focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-yellow-400 block mb-1">{t.email} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-yellow-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your official order invoice and TCS courier tracking code will be dispatched to this email.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Details (Always Required) */}
            <div className="bg-[#131622] p-5 sm:p-6 rounded-2xl border border-[#24293b] shadow-md space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>{t.shippingDetails}</span>
                </span>
                <span className="text-[11px] font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                  TCS Official Partner
                </span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-yellow-400 block mb-1">
                      {t.province} *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs cursor-pointer"
                    >
                      {PAKISTAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov} className="bg-[#181d2c] text-white">
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-yellow-400 block mb-1">
                      {t.city} *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs cursor-pointer"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#181d2c] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-yellow-400 block mb-1">
                    {t.address} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Street name, Sector/Block, Area"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-yellow-400 block mb-1">
                    {t.deliveryNotes}
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Near Shell pump / Call before delivering"
                    className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#131622] p-5 sm:p-6 rounded-2xl border border-[#24293b] shadow-md space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xs">
                  3
                </span>
                <span>{t.paymentMethodHeading}</span>
              </h3>

              <div className="space-y-3">
                {/* 1. Cash on Delivery */}
                {storeSettings.codEnabled && (
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-yellow-400 bg-[#1c2236] ring-1 ring-yellow-400 text-white'
                        : 'border-[#262c40] bg-[#121520] text-slate-300 hover:border-[#3a4360]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-yellow-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-yellow-400" />
                            {t.codLabel}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-black bg-yellow-400 px-2 py-0.5 rounded">
                            Popular Nationwide
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{t.codDesc}</p>
                      </div>
                    </div>
                  </label>
                )}

                {/* 2. Bank Transfer / JazzCash / Easypaisa */}
                <label
                  className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-yellow-400 bg-[#1c2236] ring-1 ring-yellow-400 text-white'
                      : 'border-[#262c40] bg-[#121520] text-slate-300 hover:border-[#3a4360]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 accent-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-yellow-400" />
                          {t.bankLabel}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <span className="text-red-400">JazzCash</span> •{' '}
                          <span className="text-emerald-400">Easypaisa</span> •{' '}
                          <span className="text-yellow-400">Meezan</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{t.bankDesc}</p>

                      {/* Expanded Account Details if selected */}
                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-4 p-4 rounded-xl bg-[#181d2c] border border-[#2b3145] space-y-3 text-xs">
                          <div className="border-b border-[#24293c] pb-2">
                            <span className="font-bold text-yellow-400 block">
                              Option A: Meezan Bank (Islamic)
                            </span>
                            <div className="text-[11px] font-mono text-slate-300 mt-1 space-y-0.5">
                              <p>Title: {storeSettings.bankDetails.accountTitle}</p>
                              <p>Account: {storeSettings.bankDetails.accountNumber}</p>
                              <p>IBAN: {storeSettings.bankDetails.iban}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-b border-[#24293c] pb-2">
                            <div>
                              <span className="font-bold text-red-400 block">Option B: JazzCash</span>
                              <p className="text-[11px] font-mono mt-0.5 text-slate-300">
                                {storeSettings.jazzCashDetails.accountNumber} ({storeSettings.jazzCashDetails.accountTitle})
                              </p>
                            </div>
                            <div>
                              <span className="font-bold text-emerald-400 block">Option C: Easypaisa</span>
                              <p className="text-[11px] font-mono mt-0.5 text-slate-300">
                                {storeSettings.easypaisaDetails.accountNumber} ({storeSettings.easypaisaDetails.accountTitle})
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <div>
                              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                                {t.enterRef} *
                              </label>
                              <input
                                type="text"
                                value={trxRefNumber}
                                onChange={(e) => setTrxRefNumber(e.target.value)}
                                placeholder="e.g. TID-982471928 / TRX 4819"
                                className="w-full bg-[#131622] border border-[#2b3145] text-white rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-yellow-400"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                                {t.uploadProof}
                              </label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-yellow-400 file:text-black cursor-pointer"
                              />
                              {paymentProofImage && (
                                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                                  <FileCheck className="w-3.5 h-3.5" />
                                  Receipt attached ready for admin verification!
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* 3. Debit / Credit Card */}
                <label
                  className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-yellow-400 bg-[#1c2236] ring-1 ring-yellow-400 text-white'
                      : 'border-[#262c40] bg-[#121520] text-slate-300 hover:border-[#3a4360]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-cyan-400" />
                          {t.cardLabel}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-400/80">
                          <span>Visa</span> • <span>Mastercard</span> • <span>PayFast</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{t.cardDesc}</p>

                      {/* Card inputs */}
                      {paymentMethod === 'card' && (
                        <div className="mt-4 p-4 rounded-xl bg-[#181d2c] border border-[#2b3145] space-y-3">
                          <div>
                            <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                              {t.cardNumber}
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-[#131622] border border-[#2b3145] text-white rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-yellow-400"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                                {t.cardExp}
                              </label>
                              <input
                                type="text"
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value)}
                                className="w-full bg-[#131622] border border-[#2b3145] text-white rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-yellow-400"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                                {t.cardCvc}
                              </label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                className="w-full bg-[#131622] border border-[#2b3145] text-white rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-yellow-400"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>PCI-DSS certified simulated sandbox. 3DS OTP verified.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Items & Total (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#131622] p-5 sm:p-6 rounded-2xl border border-[#24293b] shadow-md space-y-4 sticky top-24 text-white">
              <h3 className="font-bold text-sm text-white border-b border-[#202538] pb-3">
                {t.orderSummary} ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              {/* Items preview list */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.titleEn}
                      className="w-12 h-14 object-cover rounded-lg border border-[#2b3145] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">
                        {language === 'ur' ? item.product.titleUr : item.product.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {item.selectedVariant.size} • Qty: {item.quantity}
                      </p>
                      <span className="font-bold text-yellow-400">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-3 border-t border-[#202538] text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-white">PKR {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>- PKR {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.shipping}</span>
                  <span className="font-semibold text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">
                        FREE TCS
                      </span>
                    ) : (
                      `PKR ${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-[#202538]">
                  <span>{t.total}</span>
                  <span className="text-yellow-400">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>{t.placeOrder}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                <span>256-Bit SSL Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* 3DS Card OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#121520] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#262c40] space-y-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400/15 text-yellow-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">3D Secure Card Verification</h3>
                <p className="text-xs text-slate-400">PayFast / Bank OTP Verification</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A 6-digit one-time password has been sent to your mobile ending with •••• 9211 to authorize payment of{' '}
              <strong className="text-yellow-400">PKR {grandTotal.toLocaleString()}</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-yellow-400 block mb-1">Enter OTP Code</label>
              <input
                type="text"
                autoFocus
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 482910 (or any code for test)"
                className="w-full p-2.5 bg-[#181d2c] border border-[#2b3145] rounded-xl text-center font-mono font-bold tracking-widest text-sm text-white focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 bg-[#181d2c] hover:bg-[#202538] text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeOrderCreation}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
