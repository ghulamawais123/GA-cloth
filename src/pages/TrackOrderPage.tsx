import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Printer,
  Phone,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { OrderStatus } from '../types/store';

export const TrackOrderPage: React.FC = () => {
  const { orders, setInvoiceOrder, t, language } = useStore();

  const [orderQuery, setOrderQuery] = useState('GAC-89241');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searched, setSearched] = useState(true);

  const matchedOrder = orders.find(
    (o) =>
      o.id.toLowerCase() === orderQuery.trim().toLowerCase() ||
      (phoneQuery.trim() && o.customerPhone.includes(phoneQuery.trim())) ||
      (o.tcsTrackingNumber && o.tcsTrackingNumber.toLowerCase() === orderQuery.trim().toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const steps: { status: OrderStatus; labelEn: string; labelUr: string }[] = [
    { status: 'placed', labelEn: 'Order Placed', labelUr: 'آرڈر موصول ہوا' },
    { status: 'confirmed', labelEn: 'Payment Confirmed', labelUr: 'ادائیگی کی تصدیق' },
    { status: 'packed', labelEn: 'Quality Packed', labelUr: 'باکس میں پیک شدہ' },
    { status: 'shipped', labelEn: 'Handed to TCS Courier', labelUr: 'ٹی سی ایس کے حوالے' },
    { status: 'delivered', labelEn: 'Delivered', labelUr: 'پہنچ گیا' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = matchedOrder ? getStepIndex(matchedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* 1. Header & Search Input Box */}
      <div className="bg-[#131622] rounded-3xl p-6 sm:p-8 border border-[#22273a] shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/10">
          <Truck className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
            {t.trackTitle}
          </h1>
          <p className="text-xs text-yellow-400/80 max-w-md mx-auto mt-1">
            {t.trackSub}
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. GAC-89241)"
              required
              className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl py-2.5 px-4 text-xs font-mono font-bold focus:ring-1 focus:ring-yellow-400 text-white placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-xs font-black rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{t.checkStatus}</span>
          </button>
        </form>

        {/* Demo order suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
          <span className="text-slate-400">Try quick demo IDs:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOrderQuery(o.id);
                setSearched(true);
              }}
              className="font-mono text-yellow-400 hover:text-yellow-300 bg-[#181d2c] border border-[#2b3145] px-2.5 py-0.5 rounded cursor-pointer transition hover:border-yellow-400/40"
            >
              {o.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tracking Result */}
      {searched && (
        matchedOrder ? (
          <div className="bg-[#131622] rounded-3xl p-6 sm:p-8 border border-[#24293c] shadow-2xl space-y-8 animate-in fade-in">
            {/* Order Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24293c]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-lg text-white">
                    {matchedOrder.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                    Status: {matchedOrder.orderStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {matchedOrder.date} by <span className="text-white font-medium">{matchedOrder.customerName}</span>
                </p>
              </div>

              <div className="sm:text-right space-y-1.5">
                {matchedOrder.tcsTrackingNumber ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#181d2c] border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold">
                    <Truck className="w-3.5 h-3.5 text-yellow-400" />
                    <span>TCS: {matchedOrder.tcsTrackingNumber}</span>
                  </div>
                ) : (
                  <span className="text-xs text-yellow-400/80">Courier Assigned (Pending Pickup)</span>
                )}
                <div>
                  <button
                    onClick={() => setInvoiceOrder(matchedOrder)}
                    className="text-xs text-yellow-400 font-bold hover:text-yellow-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Packing Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                Shipment Progression
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-[#24293c] -translate-y-1/2 z-0" />
                <div
                  className="hidden sm:block absolute top-1/2 left-6 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 -translate-y-1/2 z-0 transition-all duration-500 shadow"
                  style={{
                    width: `${Math.min(100, (Math.max(0, currentStepIdx) / (steps.length - 1)) * 100)}%`,
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;

                    return (
                      <div
                        key={step.status}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                            isCompleted
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black ring-4 ring-yellow-400/20'
                              : 'bg-[#181d2c] text-slate-500 border border-[#2b3145]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-black" /> : idx + 1}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-yellow-400' : isCompleted ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {language === 'ur' ? step.labelUr : step.labelEn}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-yellow-400/90 block sm:inline">
                              (In Progress)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed History Timeline Log */}
            <div className="bg-[#0e111a] p-5 rounded-2xl border border-[#24293c] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                Courier Activity Log
              </h4>

              <div className="space-y-3">
                {matchedOrder.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0 shadow-sm shadow-yellow-400" />
                    <div>
                      <span className="font-mono text-[11px] text-slate-400 block">{event.date}</span>
                      <p className="font-semibold text-white mt-0.5">
                        {language === 'ur' ? event.noteUr : event.noteEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Helpline Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-xl border border-[#24293c] bg-[#181d2c] space-y-1">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  Shipping Destination
                </span>
                <p className="text-slate-200">{matchedOrder.shippingAddress}</p>
                <p className="text-slate-400">
                  {matchedOrder.shippingCity}, {matchedOrder.shippingProvince}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#24293c] bg-[#181d2c] space-y-1">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  Need Delivery Assistance?
                </span>
                <p className="text-slate-300">
                  TCS Helpline: 111-123-456 • GA Cloth Support: +92 300 1234567
                </p>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 hover:underline font-bold inline-block text-[11px] mt-1"
                >
                  WhatsApp Customer Desk →
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#131622] rounded-3xl p-8 border border-[#24293c] text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-yellow-400 mx-auto" />
            <h3 className="font-bold text-sm text-white">Order Not Found</h3>
            <p className="text-xs text-slate-400">
              Please double check the Order ID format (e.g. GAC-89241) or phone number.
            </p>
          </div>
        )
      )}
    </div>
  );
};
