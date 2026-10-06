import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Sparkles, 
  BatteryCharging, 
  Headphones, 
  Volume2, 
  Watch, 
  Zap, 
  Cable, 
  Smartphone, 
  Grid 
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All Gadgets': <Sparkles className="w-4 h-4" />,
  'Power Bank': <BatteryCharging className="w-4 h-4" />,
  'Earphone': <Headphones className="w-4 h-4" />,
  'Bluetooth Speaker': <Volume2 className="w-4 h-4" />,
  'Smart Watch': <Watch className="w-4 h-4" />,
  'Charger': <Zap className="w-4 h-4" />,
  'Cable': <Cable className="w-4 h-4" />,
  'Mobile Accessories': <Smartphone className="w-4 h-4" />,
  'Other Gadgets': <Grid className="w-4 h-4" />
};

export const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useShop();

  // Helper to count items per category
  const getItemCount = (catName: string) => {
    if (catName === 'All Gadgets') return products.length;
    return products.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-2" id="products-section">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            ক্যাটাগরি অনুযায়ী পণ্যসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            আপনার পছন্দের প্রয়োজনীয় গ্যাজেটটি বেছে নিন
          </p>
        </div>
      </div>

      {/* Horizontal Scrollable Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          const count = getItemCount(cat.name);
          const icon = CATEGORY_ICONS[cat.name] || <Sparkles className="w-4 h-4" />;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>
                {icon}
              </span>
              <span>{cat.banglaName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-700/80 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
