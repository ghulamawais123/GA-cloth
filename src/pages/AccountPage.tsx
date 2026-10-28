import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  MapPin,
  Printer,
  Truck,
  Plus,
  Trash2,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    userRole,
    setInvoiceOrder,
    setCurrentView,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Home (Lahore)',
      name: 'Ayesha Khan',
      city: 'Lahore',
      province: 'Punjab',
      address: 'House 18-A, Street 4, Phase 5, DHA',
      phone: '03001234567',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Studio / Office',
      name: 'Ayesha Khan',
      city: 'Karachi',
      province: 'Sindh',
      address: 'Suite 402, Business Arcade, Main Shahrah-e-Faisal',
      phone: '03219874523',
      isDefault: false,
    },
  ]);

  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Islamabad');
  const [newAddrText, setNewAddrText] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrText) return;
    setAddresses((prev) => [
      ...prev,
      {
        id: `addr-${Date.now()}`,
        label: newAddrLabel,
        name: 'Ayesha Khan',
        city: newAddrCity,
        province: 'Islamabad Capital Territory',
        address: newAddrText,
        phone: '03001234567',
        isDefault: false,
      },
    ]);
    setNewAddrLabel('');
    setNewAddrText('');
    setShowAddAddress(false);
    showToast('New address saved!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* 1. Profile Summary Card */}
      <div className="bg-[#131622] rounded-3xl p-6 sm:p-8 border border-[#24293c] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-500/10">
            AK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
                Ayesha Khan
              </h1>
              <span className="text-[10px] font-bold uppercase bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                Gold Tier Member
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">ayesha.k@example.com • +92 300 1234567</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span>Current Role: <strong className="text-yellow-400 capitalize">{userRole.replace('_', ' ')}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick action: Admin panel switch if staff */}
        <div className="flex items-center gap-2">
          {(userRole === 'super_admin' || userRole === 'manager' || userRole === 'support_staff') && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl text-xs font-black transition shadow-md cursor-pointer"
            >
              Open Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Tabs Layout */}
      <div className="bg-[#131622] rounded-3xl border border-[#24293c] shadow-2xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#24293c] bg-[#0e111a] px-6 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-yellow-400 text-yellow-400 bg-[#181d2c] rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-yellow-400 text-yellow-400 bg-[#181d2c] rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No orders found.</p>
              ) : (
                <div className="overflow-x-auto border border-[#24293c] rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#181d2c] text-yellow-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#24293c]">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2335]">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#181d2c]/60 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                          <td className="p-3 text-slate-400">{ord.date}</td>
                          <td className="p-3 text-slate-200">
                            {ord.shippingCity}, {ord.shippingProvince}
                          </td>
                          <td className="p-3 font-bold text-yellow-400">
                            PKR {ord.total.toLocaleString()}
                          </td>
                          <td className="p-3 text-slate-300">
                            <span className="capitalize font-medium">{ord.paymentMethod.replace('_', ' ')}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                  : ord.orderStatus === 'shipped'
                                  ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-500/30'
                                  : 'bg-[#181d2c] text-slate-300 border border-[#2b3145]'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setCurrentView('track-order')}
                                className="p-1.5 text-yellow-400 hover:bg-[#181d2c] rounded-lg transition"
                                title="Track TCS Courier"
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setInvoiceOrder(ord)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-[#181d2c] rounded-lg transition"
                                title="Print Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#24293c]">
                <div>
                  <h3 className="font-bold text-sm text-white">Saved Delivery Addresses</h3>
                  <p className="text-xs text-slate-400">Pre-fill shipping address during checkout.</p>
                </div>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 rounded-2xl bg-[#0e111a] border border-[#24293c] space-y-4 max-w-md animate-in fade-in"
                >
                  <h4 className="font-bold text-xs uppercase tracking-wider text-yellow-400">
                    New Delivery Location
                  </h4>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Label (e.g. Home, Office)</label>
                    <input
                      type="text"
                      required
                      value={newAddrLabel}
                      onChange={(e) => setNewAddrLabel(e.target.value)}
                      placeholder="e.g. Summer House"
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Street Address</label>
                    <textarea
                      rows={2}
                      required
                      value={newAddrText}
                      onChange={(e) => setNewAddrText(e.target.value)}
                      className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-lg p-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black rounded-lg text-xs"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-[#181d2c] border border-[#24293c] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{a.label}</span>
                        {a.isDefault && (
                          <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-2">{a.address}</p>
                      <p className="text-xs text-slate-400">{a.city}, {a.province}</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">Phone: {a.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-[#24293c] flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(a.id)}
                        className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
