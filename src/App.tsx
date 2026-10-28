import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';
import { AIStylistChat } from './components/AIStylistChat';
import { SizeGuideModal } from './components/SizeGuideModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AddProductModal } from './components/AddProductModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage, ShippingPage, ContactPage, FaqPage } from './pages/StaticPages';
import { CheckCircle2, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toastMessage, setIsAiModalOpen, language } = useStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-white selection:bg-yellow-400/30 selection:text-yellow-300">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Page Content Viewport */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Sticky Mobile Nav */}
      <MobileNav />

      {/* 5. Modals and Drawers */}
      <CartDrawer />
      <AIStylistChat />
      <SizeGuideModal />
      <InvoiceModal />
      <AddProductModal />

      {/* 6. Floating Stylist Trigger (Desktop) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#161e2e] via-[#223048] to-[#c25534] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group border border-amber-400/30"
        title="Consult Zoya AI Fashion Stylist with Gemini High Thinking"
      >
        <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-amber-300 border border-amber-400/40 relative flex-shrink-0">
          <img
            src="https://kommodo.ai/i/S9dbA9lA5JDHR6G2bTCt"
            alt={language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform -z-10" />
        </div>
        <div className="text-left text-xs pr-1">
          <p className="font-bold flex items-center gap-1.5 leading-none">
            <span>{language === 'ur' ? 'زویا AI اسٹائلسٹ' : 'Zoya AI Stylist'}</span>
            <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
              Argon
            </span>
          </p>
          <span className="text-[10px] text-amber-200/90 leading-tight">High Thinking Consultation</span>
        </div>
      </button>

      {/* 7. Global Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161e2e] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
