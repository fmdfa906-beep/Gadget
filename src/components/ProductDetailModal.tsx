import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Check, AlertCircle, Truck, ShieldCheck, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProduct, 
    closeProductDetail, 
    addToCart, 
    openCheckout, 
    settings 
  } = useShop();
  
  const [quantity, setQuantity] = useState(1);

  if (!activeProduct) return null;

  const isOutOfStock = !activeProduct.isAvailable || activeProduct.stock <= 0;
  const discountPercent = activeProduct.regularPrice > activeProduct.salePrice
    ? Math.round(((activeProduct.regularPrice - activeProduct.salePrice) / activeProduct.regularPrice) * 100)
    : 0;
  const savedAmount = activeProduct.regularPrice - activeProduct.salePrice;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(activeProduct, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(activeProduct, quantity);
    closeProductDetail();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Section */}
          <div className="relative bg-slate-100 aspect-square md:aspect-auto flex items-center justify-center overflow-hidden">
            <img
              src={activeProduct.imageUrl}
              alt={activeProduct.name}
              className="w-full h-full object-cover object-center max-h-[380px] md:max-h-full"
            />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 text-xs font-black bg-rose-600 text-white rounded-lg shadow-sm">
                  {discountPercent}% ডিসকাউন্ট
                </span>
              )}
              {activeProduct.badge && (
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-500 text-slate-950 rounded-lg shadow-sm">
                  {activeProduct.badge}
                </span>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-5 sm:p-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Stock */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {activeProduct.category}
                </span>

                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5" />
                    স্টক শেষ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Check className="w-3.5 h-3.5" />
                    স্টকে আছে ({activeProduct.stock} টি)
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {activeProduct.name}
              </h1>

              {/* Rating */}
              {activeProduct.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{activeProduct.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({activeProduct.reviewsCount || 45} গ্রাহকের রিভিউ)
                  </span>
                </div>
              )}

              {/* Price Details */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">বিক্রয় মূল্য:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                      ৳{activeProduct.salePrice.toLocaleString('en-US')}
                    </span>
                    {activeProduct.regularPrice > activeProduct.salePrice && (
                      <span className="text-sm sm:text-base text-slate-400 line-through">
                        ৳{activeProduct.regularPrice.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>
                </div>

                {savedAmount > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                      সাশ্রয় ৳{savedAmount}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  পণ্য সম্পর্কে তথ্য / স্পেসিফিকেশন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {activeProduct.description}
                </p>
              </div>

              {/* Delivery Features */}
              <div className="mt-4 space-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ঢাকা সিটিতে ডেলিভারি ৳{settings.insideDhakaDelivery}, ঢাকার বাইরে ৳{settings.outsideDhakaDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>১০০% আসল প্রোডাক্ট ও ক্যাশ অন ডেলিভারি (পণ্য দেখে পেমেন্ট)</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-5 pt-3">
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-700">পরিমাণ নির্বাচন করুন:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-bold text-sm text-slate-800 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(activeProduct.stock, quantity + 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 active:scale-95'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all ${
                    isOutOfStock
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 shadow-emerald-600/30'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>এখনই অর্ডার করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
