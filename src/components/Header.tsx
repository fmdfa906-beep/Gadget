import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  ShieldCheck, 
  Phone, 
  Sparkles,
  Zap,
  Menu,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    openAdminPanel,
    isAdminLoggedIn 
  } = useShop();

  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsapp = cleanWhatsappNumber.startsWith('880') 
    ? cleanWhatsappNumber 
    : cleanWhatsappNumber.startsWith('0') 
      ? `88${cleanWhatsappNumber}` 
      : `880${cleanWhatsappNumber}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-sm py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
            <span className="truncate">{settings.announcement}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs shrink-0 text-emerald-100">
            <a 
              href={`https://wa.me/${formattedWhatsapp}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>হোয়াটসঅ্যাপ: {settings.whatsappNumber}</span>
            </a>
            <span className="text-emerald-400">|</span>
            <div className="flex items-center gap-1 text-emerald-200">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>১০০% অথেনটিক গ্যাজেট</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-xl font-black tracking-tighter">GG</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-800 bg-clip-text text-transparent">
                    {settings.shopName}
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                    BD
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium -mt-0.5">
                  ইলেকট্রনিক গ্যাজেট শপ
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="স্মার্ট ওয়াচ, ইয়ারফোন, পাওয়ার ব্যাংক বা গ্যাজেট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-300 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchVisibleMobile(!isSearchVisibleMobile)}
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Quick Chat (Mobile & Tablet) */}
            <a
              href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('Hello Gadget Garden, আমি একটি পণ্য সম্পর্কে জানতে চাচ্ছি।')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            {/* Admin Panel Button */}
            <button
              onClick={openAdminPanel}
              className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all ${
                isAdminLoggedIn
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Admin Dashboard"
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন'}</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 sm:px-4 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:mr-1.5" />
              <span className="hidden sm:inline font-bold">কার্ট</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:ml-1.5 bg-amber-400 text-slate-900 font-extrabold text-xs w-5 h-5 sm:min-w-5 sm:px-1 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row (Collapsible) */}
        {isSearchVisibleMobile && (
          <div className="md:hidden pb-3 pt-1 animate-fadeIn">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="স্মার্ট ওয়াচ, ইয়ারফোন, পাওয়ার ব্যাংক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
