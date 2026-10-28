import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  Send,
  Building,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
          Since 1984
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif">
          {language === 'ur' ? 'جی اے کلوتھ کی روایتی داستان' : 'The Legacy of GA Cloth'}
        </h1>
        <p className="text-sm text-yellow-300/80 max-w-xl mx-auto leading-relaxed">
          Four decades of curating Pakistan's finest Egyptian lawn, pure crinkle chiffon, and artisanal hand-embroidered couture.
        </p>
      </div>

      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[#24293c]">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
          alt="Artisans at GA Cloth"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-[#131622] p-8 rounded-3xl border border-[#24293c] text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4 shadow-xl">
        <p>
          Founded in the historic textile heart of Lahore, GA Cloth has championed the rich weaving traditions of Pakistan. From royal zari banarsi motifs to the breathability of combed Egyptian lawn, our design house bridges generational craftsmanship with contemporary silhouettes.
        </p>
        <p>
          From prestigious bridal runways to festive Eid launches, GA Cloth ensures every ensemble reflects perfection in drape, authentic resham threadwork, and pure textile craftsmanship for clients across Pakistan and overseas.
        </p>
      </div>
    </div>
  );
};

export const ShippingPage: React.FC = () => {
  const { storeSettings, language } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
          {language === 'ur' ? 'شپنگ اور واپسی کی پالیسی' : 'TCS Shipping & 7-Day Returns'}
        </h1>
        <p className="text-xs text-yellow-400/80 max-w-md mx-auto">
          Fast, reliable express shipping across all cities, towns, and villages of Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-2.5 shadow-xl">
          <Truck className="w-6 h-6 text-yellow-400" />
          <h3 className="font-bold text-sm text-white">Delivery Timelines</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Karachi, Lahore, Islamabad/Rawalpindi: <strong className="text-yellow-400">1 - 2 business days</strong>. Other nationwide cities: <strong className="text-yellow-400">2 - 4 business days</strong>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-2.5 shadow-xl">
          <ShieldCheck className="w-6 h-6 text-yellow-400" />
          <h3 className="font-bold text-sm text-white">Shipping Charges</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Flat PKR {storeSettings.standardShippingFee} per order. <strong className="text-yellow-400">FREE SHIPPING</strong> on all orders above PKR {storeSettings.freeShippingThreshold.toLocaleString()}.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-2.5 shadow-xl">
          <RotateCcw className="w-6 h-6 text-yellow-400" />
          <h3 className="font-bold text-sm text-white">7-Day Easy Exchange</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Physical unstitched and ready-to-wear items can be exchanged within 7 days if unwashed and with original tags.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { showToast, language } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      language === 'ur'
        ? 'شکریہ! آپ کا پیغام موصول ہو گیا۔ ہماری سپورٹ ٹیم جلد رابطہ کرے گی۔'
        : 'Thank you! Your message has been received. Our concierge will respond shortly.'
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
          {language === 'ur' ? 'ہم سے رابطہ فرمائیں' : 'Contact GA Cloth'}
        </h1>
        <p className="text-xs text-yellow-400/80 max-w-md mx-auto">
          Visit our flagship boutiques in Lahore and Karachi or speak to our customer care specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information & Flagships */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-4 text-xs shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-yellow-400" />
              <span>Flagship Boutiques</span>
            </h3>

            <div className="border-t border-[#24293c] pt-3">
              <strong className="text-yellow-400 block font-bold">Lahore Flagship:</strong>
              <p className="text-slate-300 mt-0.5">42-L, Main Boulevard, Gulberg III, Lahore</p>
            </div>

            <div className="border-t border-[#24293c] pt-3">
              <strong className="text-yellow-400 block font-bold">Karachi Boutique:</strong>
              <p className="text-slate-300 mt-0.5">Plot 12-C, 7th Zamzama Commercial Lane, Clifton, Karachi</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-3 text-xs shadow-xl">
            <h3 className="font-bold text-sm text-white">Direct Assistance</h3>
            <p className="flex items-center gap-2.5 text-slate-200">
              <Phone className="w-4 h-4 text-yellow-400" />
              <span>UAN / WhatsApp: <strong className="text-yellow-400">+92 300 1234567</strong></span>
            </p>
            <p className="flex items-center gap-2.5 text-slate-200">
              <Mail className="w-4 h-4 text-yellow-400" />
              <span>support@gacloth.pk</span>
            </p>
            <p className="flex items-center gap-2.5 text-slate-200">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>Monday to Saturday: 10:00 AM – 10:00 PM PKT</span>
            </p>
          </div>
        </div>

        {/* Message Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] shadow-2xl space-y-4 text-xs"
        >
          <h3 className="font-bold text-sm text-white">Send an Inquiry</h3>

          <div>
            <label className="font-bold text-yellow-400 block mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zainab Bibi"
              className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="font-bold text-yellow-400 block mb-1">Email or WhatsApp Number</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="0300XXXXXXX or email"
              className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="font-bold text-yellow-400 block mb-1">Message / Order Query</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about tailoring sizes, fabric availability, or bridal orders..."
              className="w-full bg-[#181d2c] border border-[#2b3145] text-white rounded-xl p-2.5 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black rounded-xl font-black transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { language } = useStore();

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work with TCS?',
      a: 'When placing an order for physical unstitched or ready-to-wear garments, select Cash on Delivery. TCS rider will deliver the sealed package to your address and collect cash payment on delivery.',
    },
    {
      q: 'How do I submit payment for Bank Transfer, JazzCash or Easypaisa?',
      a: 'Select Bank Transfer at checkout. Transfer the grand total to our official Meezan Bank, JazzCash or Easypaisa account. Enter the transaction reference ID (TRX ID) and upload your payment receipt screenshot. Our finance team verifies and approves it promptly.',
    },
    {
      q: 'Can I track my TCS parcel live online?',
      a: 'Yes! As soon as your order is dispatched, a TCS tracking consignment number is assigned. You can track your parcel live anytime using our Track Order page or on the official TCS website.',
    },
    {
      q: 'What is the unstitched fabric length provided?',
      a: 'Standard unstitched 3-piece suits come with a generous 3.0 meters shirt fabric, 2.5 meters dupatta, and 2.5 meters trouser fabric, providing ample material even for flared kurtis and wide-leg trousers.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
          {language === 'ur' ? 'اکثر پوچھے گئے سوالات' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs text-yellow-400/80">
          Everything you need to know about ordering, fabrics, and nationwide TCS delivery.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#131622] border border-[#24293c] space-y-2 shadow-xl">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
