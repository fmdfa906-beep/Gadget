import React from 'react';
import { Truck, ShieldCheck, RefreshCw, MessageSquareQuote, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Banner: React.FC = () => {
  const { settings } = useShop();

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsapp = cleanWhatsappNumber.startsWith('880') 
    ? cleanWhatsappNumber 
    : cleanWhatsappNumber.startsWith('0') 
      ? `88${cleanWhatsappNumber}` 
      : `880${cleanWhatsappNumber}`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Main Promo Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white shadow-xl">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative px-5 py-8 sm:px-10 sm:py-12 z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>গেজেট গ্যাজেটে প্রিমিয়াম অফার</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              সেরা মূল্যে ১০০% অরিজিনাল <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                ইলেকট্রনিক গ্যাজেট
              </span>
            </h1>

            <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
              সারা বাংলাদেশে সবচেয়ে দ্রুততম ক্যাশ অন ডেলিভারি। স্মার্ট ওয়াচ, এয়ারবাডস, পাওয়ার ব্যাংক ও ফাস্ট চার্জার কিনুন নিশ্চিন্তে।
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
              <a
                href="#products-section"
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
              >
                পণ্যসমূহ দেখুন
              </a>
              <a
                href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('Hello Gadget Garden, আমি আপনাদের পণ্যগুলো দেখতে চাই।')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors flex items-center gap-1.5"
              >
                <span>হোয়াটসঅ্যাপে অর্ডার</span>
              </a>
            </div>
          </div>

          {/* Quick Features Highlight Box */}
          <div className="w-full md:w-auto grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">৳{settings.insideDhakaDelivery}</div>
              <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">ঢাকা সিটিতে ডেলিভারি</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">৳{settings.outsideDhakaDelivery}</div>
              <div className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">ঢাকার বাইরে সারা দেশে</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl text-center col-span-2">
              <div className="text-xs sm:text-sm font-bold text-amber-300">📦 ক্যাশ অন ডেলিভারি সুবিধা</div>
              <div className="text-[10px] sm:text-xs text-slate-300 mt-0.5">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">সারা দেশে ডেলিভারি</div>
            <div className="text-[10px] sm:text-xs text-slate-500">৬৪ জেলায় দ্রুততম সময়ে</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">১০০% আসল প্রোডাক্ট</div>
            <div className="text-[10px] sm:text-xs text-slate-500">ব্র্যান্ড ওয়্যারেন্টি সাপোর্ট</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">সহজ রিটার্ন পলিসি</div>
            <div className="text-[10px] sm:text-xs text-slate-500">চেক করে নেয়ার সুযোগ</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">সরাসরি হোয়াটসঅ্যাপ</div>
            <div className="text-[10px] sm:text-xs text-slate-500">দ্রুত অর্ডার ও সহায়তা</div>
          </div>
        </div>
      </div>
    </div>
  );
};
