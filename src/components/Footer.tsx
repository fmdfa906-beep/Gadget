import React from 'react';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Sparkles,
  Heart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { settings, openAdminPanel, isAdminLoggedIn } = useShop();

  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsapp = cleanWhatsappNumber.startsWith('880') 
    ? cleanWhatsappNumber 
    : cleanWhatsappNumber.startsWith('0') 
      ? `88${cleanWhatsappNumber}` 
      : `880${cleanWhatsappNumber}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg">
                GG
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {settings.shopName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {settings.shopDescription}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${formattedWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Delivery & Payment Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              ডেলিভারি ও পেমেন্ট
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ঢাকা সিটি: ৳{settings.insideDhakaDelivery} (২৪-৪৮ ঘণ্টা)</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ঢাকার বাইরে: ৳{settings.outsideDhakaDelivery} (২-৩ দিন)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি (হাতে পেয়ে পেমেন্ট)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>১০০% আসল প্রোডাক্ট ও রিপ্লেসমেন্ট সুবিধা</span>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Admin Link */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              যোগাযোগ ও এডমিন
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>হটলাইন: {settings.phoneContact}</span>
              </div>

              <div className="pt-3">
                <button
                  onClick={openAdminPanel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAdminLoggedIn ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন লগইন'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.shopName}. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>বাংলাদেশে তৈরি</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>ইলেকট্রনিক গ্যাজেট শপ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
