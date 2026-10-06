import React from 'react';
import { ShoppingBag, Zap, Check, AlertCircle, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openProductDetail, openCheckout } = useShop();

  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const discountPercent = product.regularPrice > product.salePrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    openCheckout();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => openProductDetail(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-emerald-300"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            // Fallback placeholder image if URL fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-black bg-rose-600 text-white rounded-md shadow-xs">
              {discountPercent}% ছাড়
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-red-500/90 backdrop-blur-xs text-white rounded-md">
              <AlertCircle className="w-3 h-3" />
              স্টক শেষ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-600/90 backdrop-blur-xs text-white rounded-md">
              <Check className="w-3 h-3" />
              স্টকে আছে
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-800 rounded-full text-xs font-bold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            বিস্তারিত দেখুন
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold truncate max-w-[130px]">
              {product.category}
            </span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                )}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-black text-emerald-600">
                ৳{product.salePrice.toLocaleString('en-US')}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
                  ৳{product.regularPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                মাত্র {product.stock} টি বাকি
              </span>
            )}
          </div>

          {/* Dual Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 active:scale-95'
              }`}
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">কার্টে রাখুন</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white active:scale-95 shadow-emerald-600/20'
              }`}
              title="এখনই অর্ডার করুন"
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">এখনই কিনুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
