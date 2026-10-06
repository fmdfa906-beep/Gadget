import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    openCheckout,
    settings 
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                আপনার শপিং কার্ট ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">আপনার কার্ট বর্তমানে খালি</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
                  আপনার পছন্দের স্মার্ট ওয়াচ, হেডফোন বা গ্যাজেটটি কার্টে যোগ করুন।
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const itemTotal = item.product.salePrice * item.quantity;
                  return (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 sm:gap-4 items-center">
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200/80"
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                          ৳{item.product.salePrice.toLocaleString('en-US')} × {item.quantity} ={' '}
                          <span className="font-extrabold text-slate-900">৳{itemTotal.toLocaleString('en-US')}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-l transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-800 min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-r transition-colors disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">পণ্যগুলোর মোট মূল্য:</span>
                <span className="text-base font-extrabold text-slate-900">
                  ৳{cartSubtotal.toLocaleString('en-US')}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                💡 <span className="font-semibold text-slate-700">ডেলিভারি চার্জ:</span> ঢাকা সিটিতে ৳{settings.insideDhakaDelivery} এবং ঢাকার বাইরে ৳{settings.outsideDhakaDelivery} (পরের ধাপে জেলা নির্বাচনের পর যুক্ত হবে)।
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
