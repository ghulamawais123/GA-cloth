import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilters, t, language, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast(
        language === 'ur'
          ? 'شکریہ! آپ کو ۱۰٪ ڈسکاؤنٹ واؤچر ای میل کر دیا گیا ہے۔'
          : 'Thank you! A 10% welcome coupon has been sent to your email.'
      );
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0b0c10] text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-[#1f2435]">
      {/* 1. Value Proposition & Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-[#1f2435]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#131622] border border-[#24293c] shadow-lg">
            <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.badge1Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.badge1Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#131622] border border-[#24293c] shadow-lg">
            <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.badge2Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.badge2Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#131622] border border-[#24293c] shadow-lg">
            <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.badge3Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.badge3Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#131622] border border-[#24293c] shadow-lg">
            <div className="p-2.5 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.badge4Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.badge4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://kommodo.ai/i/7AGt4hT5ycQ3XmmLzdK5"
                alt={language === 'ur' ? 'جی اے کلوتھ لوگو' : 'GA Cloth Logo'}
                className="h-10 w-auto max-w-[180px] object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-black font-serif font-black text-lg shadow-md">
                  GA
                </div>
                <span className="text-xl font-black tracking-tight text-white font-serif">GA CLOTH</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {language === 'ur'
                ? 'جی اے کلوتھ پاکستان کا ممتاز ترین فیشن برانڈ ہے، جہاں آپ کو خالص پاکستانی لان، شاہانہ شفون اور دلکش ریڈی ٹو ویئر ملبوسات دستیاب ہیں۔'
                : 'Pakistan’s premier high-end fashion and couture apparel platform. Offering genuine unstitched lawn, luxury evening pret, and hand-embroidered festive formals nationwide.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                <span>Gulberg III, Lahore & Clifton, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                <span>UAN / WhatsApp: <strong className="text-yellow-400">+92 300 1234567</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Mon - Sat: 10:00 AM - 10:00 PM (PKT)</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-yellow-400 mb-3 tracking-wide">
              {language === 'ur' ? 'کیٹیگریز' : 'Shop Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'cat-unstitched' }));
                    setCurrentView('shop');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                >
                  {t.unstitched}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'cat-pret' }));
                    setCurrentView('shop');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                >
                  {t.pret}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'cat-festive' }));
                    setCurrentView('shop');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                >
                  {t.festive}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'cat-menswear' }));
                    setCurrentView('shop');
                  }}
                  className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                >
                  {t.menswear}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-yellow-400 mb-3 tracking-wide">
              {language === 'ur' ? 'کسٹمر کیئر' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('track-order')} className="text-slate-300 hover:text-yellow-400 transition cursor-pointer">
                  {t.trackOrder} (TCS)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shipping')} className="text-slate-300 hover:text-yellow-400 transition cursor-pointer">
                  {language === 'ur' ? 'شپنگ و واپسی کی پالیسی' : 'Shipping & 7-Day Returns'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('faq')} className="text-slate-300 hover:text-yellow-400 transition cursor-pointer">
                  {language === 'ur' ? 'اکثر پوچھے گئے سوالات' : 'Payment & Tailoring FAQs'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('about')} className="text-slate-300 hover:text-yellow-400 transition cursor-pointer">
                  {language === 'ur' ? 'ہمارے بارے میں' : 'About GA Cloth Heritage'}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="text-slate-300 hover:text-yellow-400 transition cursor-pointer">
                  {language === 'ur' ? 'رابطہ کریں' : 'Contact & Store Locations'}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payment Methods */}
          <div>
            <h4 className="text-sm font-bold text-yellow-400 mb-2 tracking-wide">
              {language === 'ur' ? 'خصوصی آفرز حاصل کریں' : 'Join VIP Club'}
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              {language === 'ur'
                ? 'اپنا ای میل درج کریں اور پہلے آرڈر پر ۱۰٪ رعایت کا واؤچر حاصل کریں۔'
                : 'Subscribe for lawn launch previews and get 10% off your next purchase.'}
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={language === 'ur' ? 'آپ کا ای میل ایڈریس...' : 'Enter your email...'}
                  required
                  className="w-full bg-[#181d2c] border border-[#2b3145] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-md"
              >
                {language === 'ur' ? 'سبسکرائب کریں' : 'Get 10% Coupon'}
              </button>
            </form>

            {/* Payment & Logistics Badges */}
            <div className="mt-4 pt-3 border-t border-[#1f2435]">
              <span className="text-[10px] uppercase font-bold text-yellow-400/80 tracking-wider block mb-1.5">
                {language === 'ur' ? 'ادائیگی اور ڈلیوری کے شراکت دار' : 'Payment & Delivery Partners'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-sm bg-[#181d2c] text-[10px] font-bold text-yellow-300 border border-[#2b3145]">
                  JazzCash
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-[#181d2c] text-[10px] font-bold text-yellow-300 border border-[#2b3145]">
                  Easypaisa
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-[#181d2c] text-[10px] font-bold text-yellow-300 border border-[#2b3145]">
                  Meezan Bank
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-[#181d2c] text-[10px] font-bold text-yellow-300 border border-[#2b3145]">
                  TCS Courier
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-[#181d2c] text-[10px] font-bold text-yellow-300 border border-[#2b3145]">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-[#1f2435] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} GA Cloth Pakistan. All Rights Reserved.</p>
        <div className="flex items-center gap-1 text-[11px]">
          <span>Handcrafted with</span>
          <Heart className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-slate-300">for Pakistani Textile Lovers</span>
        </div>
      </div>
    </footer>
  );
};
