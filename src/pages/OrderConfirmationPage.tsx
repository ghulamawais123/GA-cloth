import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Printer,
  Truck,
  Clock,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, selectedOrderId, setCurrentView, setInvoiceOrder, language } =
    useStore();

  const currentOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">No active order found.</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-[#161e2e] text-white rounded-xl text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in">
      {/* 1. Success Banner */}
      <div className="bg-white rounded-3xl border border-[#ece6db] p-6 sm:p-10 text-center shadow-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#c25534] uppercase tracking-wider block mb-1">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            {language === 'ur'
              ? 'شکریہ! آپ کا آرڈر کامیابی سے درج ہو چکا ہے۔'
              : 'Thank You! Your GA Cloth Order is Confirmed.'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Confirmation email with packing slip sent to{' '}
            <strong className="text-slate-800">{currentOrder.customerEmail}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase">Order Number</span>
            <span className="font-mono font-bold text-slate-900">{currentOrder.id}</span>
          </div>

          <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase">Payment Mode</span>
            <span className="font-bold text-slate-900 uppercase">
              {currentOrder.paymentMethod.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase">Grand Total</span>
            <span className="font-black text-[#c25534]">PKR {currentOrder.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setInvoiceOrder(currentOrder)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#161e2e] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Invoice</span>
          </button>

          <button
            onClick={() => setCurrentView('track-order')}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track TCS Consignment</span>
          </button>
        </div>
      </div>

      {/* 2. TCS Shipping Expectation & Address Info */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#c25534]" />
          <span>TCS Courier Express Delivery Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Delivery Address
            </span>
            <p className="font-bold text-slate-800 mt-1">{currentOrder.customerName}</p>
            <p className="text-slate-600">{currentOrder.shippingAddress}</p>
            <p className="text-slate-600">
              {currentOrder.shippingCity}, {currentOrder.shippingProvince}
            </p>
            <p className="text-slate-600 font-mono mt-1">Phone: {currentOrder.customerPhone}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Estimated Delivery Window
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>2 - 4 Business Days</span>
            </p>
            {currentOrder.tcsTrackingNumber && (
              <p className="text-[11px] font-mono text-[#c25534] font-bold">
                Consignment #: {currentOrder.tcsTrackingNumber}
              </p>
            )}
            <p className="text-[11px] text-slate-500">
              You will receive an automated SMS from TCS once your parcel is out for delivery.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Footer CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentView('shop')}
          className="px-8 py-3 bg-[#161e2e] hover:bg-[#c25534] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
        >
          Continue Shopping with GA Cloth
        </button>
      </div>
    </div>
  );
};
