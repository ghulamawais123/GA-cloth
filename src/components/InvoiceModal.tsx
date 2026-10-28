import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceOrder, setInvoiceOrder, language, storeSettings } = useStore();

  if (!invoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0e111a] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#262c40] overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Controls */}
        <div className="p-4 border-b border-[#24293c] bg-[#131622] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
              Tax Invoice & Packing Slip
            </span>
            <span className="font-mono font-bold text-xs bg-[#181d2c] border border-yellow-400/30 text-yellow-300 px-2 py-0.5 rounded">
              {invoiceOrder.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setInvoiceOrder(null)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#181d2c] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#0b0c10] text-white space-y-6 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24293c] print:border-slate-300">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="https://kommodo.ai/i/7AGt4hT5ycQ3XmmLzdK5"
                  alt="GA Cloth Official Logo"
                  className="h-10 w-auto max-w-[160px] object-contain print:invert"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-serif font-black text-xl flex items-center justify-center shadow">
                    GA
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white print:text-black tracking-tight">GA CLOTH</h1>
                    <p className="text-[10px] text-yellow-400 uppercase tracking-widest font-semibold print:text-slate-600">
                      Premier Pakistani Luxury Fashion & Lawn Couture
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 print:text-slate-600">
                NTN: 8934120-4 • Sales Tax Reg: 32-00-8934-120-4
                <br />
                Gulberg III, Lahore, Pakistan • UAN: +92 300 1234567
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 print:bg-slate-100 print:text-black">
                Official Receipt
              </span>
              <p className="text-sm font-black text-white mt-1 print:text-black">Invoice #: {invoiceOrder.id}</p>
              <p className="text-xs text-slate-400 print:text-slate-600">Date: {invoiceOrder.date}</p>
              {invoiceOrder.tcsTrackingNumber && (
                <p className="text-xs font-mono font-bold text-yellow-400 print:text-black">
                  TCS Consignment: {invoiceOrder.tcsTrackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#131622] border border-[#24293c] text-xs print:bg-white print:border-slate-300">
            <div>
              <h4 className="font-bold text-yellow-400 uppercase text-[10px] tracking-wider mb-1.5 print:text-slate-500">
                Billed & Shipped To:
              </h4>
              <p className="font-bold text-sm text-white print:text-black">{invoiceOrder.customerName}</p>
              <p className="text-slate-300 mt-0.5 print:text-slate-700">{invoiceOrder.shippingAddress}</p>
              <p className="text-slate-300 print:text-slate-700">
                {invoiceOrder.shippingCity}, {invoiceOrder.shippingProvince}
              </p>
              <p className="text-yellow-300 font-mono mt-1 print:text-black">Phone: {invoiceOrder.customerPhone}</p>
              <p className="text-slate-400 print:text-slate-600">Email: {invoiceOrder.customerEmail}</p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold uppercase text-[10px] tracking-wider text-yellow-400 mb-1.5 print:text-slate-500">
                Payment & Fulfillment
              </h4>
              <p className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Payment Mode:</span>
                <span className="font-bold uppercase text-white print:text-black">
                  {invoiceOrder.paymentMethod.replace('_', ' ')}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Payment Status:</span>
                <span className="font-bold uppercase text-yellow-400 print:text-green-700">
                  {invoiceOrder.paymentStatus}
                </span>
              </p>
              {invoiceOrder.paymentReferenceNumber && (
                <p className="flex justify-between">
                  <span className="text-slate-400 print:text-slate-600">Transaction Ref:</span>
                  <span className="font-mono text-yellow-300 print:text-black">
                    {invoiceOrder.paymentReferenceNumber}
                  </span>
                </p>
              )}
              <p className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Shipping Partner:</span>
                <span className="font-bold text-yellow-400 print:text-black">TCS Express Courier</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#24293c] rounded-xl overflow-hidden print:border-slate-300">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#24293c] print:bg-slate-100 print:text-black">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Variant / SKU</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2335] print:divide-slate-200">
                {invoiceOrder.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#0e111a]' : 'bg-[#131622]'}>
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-semibold text-white print:text-black">
                      {item.product.titleEn}
                      <span className="block text-[10px] text-yellow-400/80 font-normal">
                        Fabric: {item.product.fabric}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-mono text-[11px] print:text-slate-600">
                      {item.selectedVariant.size} • {item.selectedVariant.sku}
                    </td>
                    <td className="p-3 text-center font-bold text-white print:text-black">{item.quantity}</td>
                    <td className="p-3 text-right text-slate-300 print:text-slate-800">PKR {item.price.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-yellow-400 print:text-black">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-white print:text-black">
                  PKR {invoiceOrder.subtotal.toLocaleString()}
                </span>
              </div>
              {invoiceOrder.discount > 0 && (
                <div className="flex justify-between text-yellow-400 font-semibold">
                  <span>Discount ({invoiceOrder.appliedCoupon}):</span>
                  <span>- PKR {invoiceOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>TCS Shipping Charges:</span>
                <span className="font-semibold text-white print:text-black">
                  {invoiceOrder.shippingFee === 0 ? 'FREE' : `PKR ${invoiceOrder.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-[#24293c] print:border-slate-300 print:text-black">
                <span>Grand Total (PKR):</span>
                <span className="text-yellow-400 font-black">PKR {invoiceOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Verification Stamp & Terms */}
          <div className="pt-6 border-t border-[#24293c] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 print:border-slate-300 print:text-slate-600">
            <div className="space-y-0.5">
              <p className="font-semibold text-yellow-300 print:text-black">Thank you for shopping at GA Cloth!</p>
              <p>For inquiries: support@gacloth.pk • Track online at gacloth.pk/track</p>
              <p>Physical items covered by 7-day exchange policy in original unstitched/unworn form.</p>
            </div>
            <div className="p-3 rounded-xl border border-dashed border-yellow-400/40 bg-yellow-400/10 text-yellow-300 flex items-center gap-2 print:border-slate-400 print:text-black">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <div className="text-[10px]">
                <p className="font-bold text-yellow-400">VERIFIED GENUINE ORDER</p>
                <p className="text-slate-300">GA Cloth Quality Assurance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
