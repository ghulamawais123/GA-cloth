import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, Sparkles, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, cartCount, setIsCartOpen, setIsAiModalOpen, language } = useStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e111a]/95 backdrop-blur-md border-t border-[#22273a] px-3 py-2 shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-items-center text-center">
        {/* Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            currentView === 'home' ? 'text-yellow-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{language === 'ur' ? 'ہوم' : 'Home'}</span>
        </button>

        {/* Categories / Shop */}
        <button
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            currentView === 'shop' ? 'text-yellow-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{language === 'ur' ? 'شاپ' : 'Shop'}</span>
        </button>

        {/* AI Stylist */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-yellow-400 transition cursor-pointer group"
        >
          <div className="w-10 h-10 -mt-5 rounded-full overflow-hidden bg-gradient-to-tr from-yellow-500 via-amber-500 to-yellow-300 flex items-center justify-center text-black shadow-lg shadow-yellow-500/30 group-hover:scale-105 transition-transform border-2 border-yellow-400 relative">
            <img
              src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
              alt={language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Sparkles className="w-4 h-4 fill-black -z-10 absolute" />
          </div>
          <span className="text-[10px] font-bold text-yellow-400">
            {language === 'ur' ? 'زویا AI' : 'Stylist'}
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">{language === 'ur' ? 'بیگ' : 'Cart'}</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setCurrentView('account')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            currentView === 'account' ? 'text-yellow-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{language === 'ur' ? 'اکاؤنٹ' : 'Account'}</span>
        </button>
      </div>
    </div>
  );
};
