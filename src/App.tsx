import React from 'react';
import { 
  ShopProvider, 
  useShop 
} from './context/ShopContext';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { 
  ShoppingBag, 
  MessageCircle, 
  Search, 
  Frown, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info 
} from 'lucide-react';

const ShopContent: React.FC = () => {
  const { 
    products, 
    loading, 
    searchQuery, 
    selectedCategory, 
    cartCount, 
    cartSubtotal,
    setIsCartOpen,
    settings,
    toast 
  } = useShop();

  // Filter products by category and search query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = 
      selectedCategory.toLowerCase() === 'all gadgets' ||
      selectedCategory.toLowerCase() === 'সব গ্যাজেট' ||
      prod.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = 
      !searchQuery.trim() ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsapp = cleanWhatsappNumber.startsWith('880') 
    ? cleanWhatsappNumber 
    : cleanWhatsappNumber.startsWith('0') 
      ? `88${cleanWhatsappNumber}` 
      : `880${cleanWhatsappNumber}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-bold text-white ${
            toast.type === 'error' ? 'bg-rose-600' :
            toast.type === 'info' ? 'bg-slate-800' :
            'bg-emerald-600'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> :
             toast.type === 'info' ? <Info className="w-4 h-4 shrink-0" /> :
             <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Hero Banner with Features */}
      <Banner />

      {/* Category Horizontal Filter Pills */}
      <CategoryFilter />

      {/* Products Showcase Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 w-full">
        {/* Active Filter Bar & Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            {searchQuery ? (
              <span>"{searchQuery}" এর জন্য {filteredProducts.length}টি গ্যাজেট পাওয়া গেছে</span>
            ) : (
              <span>মোট <strong className="text-slate-800">{filteredProducts.length}টি</strong> গ্যাজেট উপলব্ধ</span>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-semibold">পণ্য লোড হচ্ছে...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              কোনো গ্যাজেট পাওয়া যায়নি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              অন্য কোনো নামে সার্চ করুন অথবা সব ক্যাটাগরি ব্রাউজ করুন।
            </p>
          </div>
        ) : (
          /* Product Grid: 2 cols on mobile (Android friendly), 3 cols on md, 4 cols on lg */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Buttons for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5">
        {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('Hello Gadget Garden, আমি একটি পণ্য অর্ডার করতে চাই।')}`}
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center active:scale-95 transition-transform"
          title="WhatsApp এ কথা বলুন"
          aria-label="WhatsApp Chat"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>

        {/* Floating Cart Pill (Mobile) */}
        {cartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="md:hidden flex items-center gap-2 py-2 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-700/30 font-bold text-xs active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>৳{cartSubtotal.toLocaleString('en-US')}</span>
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        )}
      </div>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminLoginModal />
      <AdminDashboard />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
