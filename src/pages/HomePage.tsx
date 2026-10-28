import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  Scissors,
  CheckCircle,
  Truck,
  Star,
  Layers,
  ChevronRight,
  Shirt,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    setCurrentView,
    setFilters,
    setIsAiModalOpen,
    t,
    language,
    reviews,
  } = useStore();

  // Flash Sale Live Timer Countdown (e.g. 14 hours, 32 mins, 45 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<'all' | 'unstitched' | 'pret' | 'festive' | 'menswear'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'unstitched') return p.category === 'cat-unstitched';
    if (activeTab === 'pret') return p.category === 'cat-pret';
    if (activeTab === 'festive') return p.category === 'cat-festive';
    if (activeTab === 'menswear') return p.category === 'cat-menswear';
    return true;
  });

  const flashDealProducts = products.filter((p) => p.isFlashDeal);
  const festiveSpotlightProducts = products.filter((p) => p.category === 'cat-festive').slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#161e2e] text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://kommodo.ai/i/zjxalCvDgmbtQLSM51YS"
            alt={language === 'ur' ? 'جی اے کلوتھ فیسٹیو کلیکشن' : 'GA Cloth Luxury Fashion & Couture Banner'}
            className="w-full h-full object-cover object-center filter saturate-120"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121824] via-[#161e2e]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-28 flex flex-col justify-center min-h-[520px]">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-300 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'نیا فیسٹیو ایڈیشن ۲۰۲۶' : 'Autumn Festive Drop 2026'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] font-serif">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'all' }));
                  setCurrentView('shop');
                }}
                className="px-6 py-3.5 bg-[#c25534] hover:bg-[#a84426] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <span>{t.shopNow}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, category: 'cat-pret' }));
                  setCurrentView('shop');
                }}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Shirt className="w-4 h-4 text-amber-300" />
                <span>{t.viewPret}</span>
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-4 py-3.5 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'ur' ? 'فیشن مشورہ لیں (AI)' : 'Ask Zoya AI Stylist'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flash Sale Strip with Countdown (4 Products Per Row) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500 via-[#c25534] to-[#9c3a1e] rounded-2xl p-4 sm:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-amber-200">
              <Flame className="w-7 h-7 fill-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight">{t.flashDealsTitle}</h2>
                <span className="bg-white text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Up to 30% OFF
                </span>
              </div>
              <p className="text-xs text-amber-100">
                {language === 'ur'
                  ? 'محدود مدت کے لیے خصوصی رعایت۔ خالص لان، شفون اور سلے کُرتے۔'
                  : 'Limited time festive pricing on unstitched lawn, pure chiffon & pret ensembles.'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 text-center self-start md:self-auto">
            <span className="text-xs font-bold mr-1 opacity-90 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t.endsIn}
            </span>

            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10 min-w-12">
              <span className="font-mono font-black text-sm sm:text-base text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-300 uppercase">{t.hours}</span>
            </div>

            <span className="font-bold text-lg">:</span>

            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10 min-w-12">
              <span className="font-mono font-black text-sm sm:text-base text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-300 uppercase">{t.minutes}</span>
            </div>

            <span className="font-bold text-lg">:</span>

            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10 min-w-12">
              <span className="font-mono font-black text-sm sm:text-base text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] block text-slate-300 uppercase">{t.seconds}</span>
            </div>
          </div>
        </div>

        {/* Flash Deals Carousel Grid (4 Products Per Line) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5 mt-6">
          {flashDealProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Category Showcase Grid (Exactly 4 Balanced Columns) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
              {language === 'ur' ? 'ہماری کیٹیگریز' : 'Fabric Collections'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {t.shopCategories}
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'all' }));
              setCurrentView('shop');
            }}
            className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Balanced 4-column layout for 4 physical categories */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category: cat.id }));
                setCurrentView('shop');
              }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#121520] border border-[#22273a] hover:border-yellow-400/50 cursor-pointer shadow-md hover:shadow-2xl transition-all"
            >
              <img
                src={cat.image}
                alt={language === 'ur' ? cat.nameUr : cat.nameEn}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <span className="text-[10px] font-mono text-yellow-400 uppercase font-bold tracking-wider block mb-0.5">
                  Collection
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-yellow-400 transition-colors">
                  {language === 'ur' ? cat.nameUr : cat.nameEn}
                </h3>
                <span className="text-[11px] text-yellow-300/90 flex items-center gap-1 mt-1 font-semibold">
                  <span>Explore Ensembles</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Curated Collection & Tabbed Product Grid (4 Per Row) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
              {language === 'ur' ? 'خاص پسند' : 'Handpicked For You'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {t.featuredProducts}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-[#131622] p-1.5 rounded-xl self-start md:self-auto border border-[#22273a]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'تمام ملبوسات' : 'All Ensembles'}
            </button>
            <button
              onClick={() => setActiveTab('unstitched')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'unstitched'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.unstitched}
            </button>
            <button
              onClick={() => setActiveTab('pret')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'pret'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.pret}
            </button>
            <button
              onClick={() => setActiveTab('festive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'festive'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.festive}
            </button>
            <button
              onClick={() => setActiveTab('menswear')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'menswear'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.menswear}
            </button>
          </div>
        </div>

        {/* 4 Products Per Line Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'all' }));
              setCurrentView('shop');
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-yellow-500/10 cursor-pointer"
          >
            {language === 'ur'
              ? 'تمام لگژری کلیکشن دیکھیں (20 منتخب شاہکار)'
              : 'Browse Entire Luxury Collection (20 Designer Pieces)'}
          </button>
        </div>
      </section>

      {/* 5. Luxury Bridal & Festive Spotlight (4-In-A-Row Showcase) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block mb-1">
              {language === 'ur' ? 'شاہانہ برائیڈل و فیسٹیو کلیکشن' : 'ROYAL COUTURE & BRIDAL SPOTLIGHT'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight font-serif">
              {language === 'ur' ? 'پرتعیش شادی و تقریبات کے ملبوسات' : 'Festive & Velvet Formals (4 Per Row)'}
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: 'cat-festive' }));
              setCurrentView('shop');
            }}
            className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'ur' ? 'تمام فیسٹیو دیکھیں' : 'View All Formals'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {festiveSpotlightProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
            {language === 'ur' ? 'تصدیق شدہ خریدار' : 'Verified Reviews'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {t.customerReviewsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-2xl bg-[#131622] border border-[#22273a] shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1e2333] flex items-center justify-between mt-4">
                <div>
                  <h4 className="text-xs font-bold text-white">{review.customerName}</h4>
                  <span className="text-[10px] text-yellow-400/80">{review.customerCity}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
