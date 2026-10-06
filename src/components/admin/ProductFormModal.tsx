import React, { useState, useEffect } from 'react';
import { X, Upload, Image, Check, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { Product, Category } from '../../types';
import { useShop } from '../../context/ShopContext';
import { uploadProductImage } from '../../services/firebase';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PRESET_IMAGES = [
  { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Earbuds TWS', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { label: 'Power Bank', url: 'https://images.unsplash.com/photo-1609592807904-762266db4fec?auto=format&fit=crop&w=800&q=80' },
  { label: 'BT Speaker', url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fast Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80' },
  { label: 'USB Cable', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Accessories', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80' }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const { categories, addNewProduct, updateProduct, showToast } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Power Bank');
  const [regularPrice, setRegularPrice] = useState<number>(1000);
  const [salePrice, setSalePrice] = useState<number>(850);
  const [stock, setStock] = useState<number>(20);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setRegularPrice(productToEdit.regularPrice);
      setSalePrice(productToEdit.salePrice);
      setStock(productToEdit.stock);
      setIsAvailable(productToEdit.isAvailable);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
      setBadge(productToEdit.badge || '');
    } else {
      setName('');
      setCategory(categories[1]?.name || 'Power Bank');
      setRegularPrice(1200);
      setSalePrice(990);
      setStock(25);
      setIsAvailable(true);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1609592807904-762266db4fec?auto=format&fit=crop&w=800&q=80');
      setBadge('নতুন পণ্য');
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Handle image upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবিটির সাইজ সর্বোচ্চ 5MB হতে হবে!', 'error');
      return;
    }

    setIsUploading(true);
    try {
      showToast('Firebase Storage এ ছবি আপলোড হচ্ছে...', 'info');
      const uploadedUrl = await uploadProductImage(file);
      setImageUrl(uploadedUrl);
      showToast('Firebase Storage এ ছবি সফলভাবে আপলোড হয়েছে!', 'success');
    } catch (err) {
      console.error('Storage upload failed:', err);
      showToast('ছবি আপলোডে সমস্যা হয়েছে!', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('পণ্যের নাম প্রদান করুন', 'error');
      return;
    }

    if (salePrice <= 0 || regularPrice <= 0) {
      showToast('সঠিক মূল্য প্রদান করুন', 'error');
      return;
    }

    if (!imageUrl) {
      showToast('পণ্যের ছবি যোগ করুন', 'error');
      return;
    }

    const payload: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      category,
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice),
      stock: Number(stock),
      isAvailable: isAvailable && stock > 0,
      description: description.trim() || 'পণ্যের বিস্তারিত বিবরণ শীঘ্রই যোগ করা হবে।',
      image: imageUrl,
      imageUrl: imageUrl,
      badge: badge.trim() || undefined,
      rating: productToEdit?.rating || 4.9,
      reviewsCount: productToEdit?.reviewsCount || 1,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (productToEdit) {
      await updateProduct(payload);
    } else {
      await addNewProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {productToEdit ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পণ্যের নাম (Product Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: Anker 20000mAh Power Bank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ক্যাটাগরি (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                {categories.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.banglaName} ({cat.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ব্যাজ / হাইলাইট ট্যাগ (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: সেরা অফার, বেস্ট সেলার, নতুন"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বিক্রয় মূল্য ৳ (Sale Price) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                নিয়মিত মূল্য ৳ (Regular Price)
              </label>
              <input
                type="number"
                required
                min={1}
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                স্টক সংখ্যা (Stock)
              </label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStock(val);
                  if (val === 0) setIsAvailable(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Stock Availability Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
              গ্রাহকদের জন্য বিক্রয়ের জন্য উপলব্ধ (Mark as Available / In Stock)
            </label>
          </div>

          {/* Product Image Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              পণ্যের ছবি (Image Upload & Presets) <span className="text-rose-500">*</span>
            </label>

            {/* Current Image Preview */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                {/* File Upload Button */}
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input */}
                <input
                  type="text"
                  placeholder="অথবা ছবির সরাসরি URL দিন"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium">দ্রুত প্রি-সেট ছবি নির্বাচন:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পণ্যের বিবরণ ও স্পেসিফিকেশন (Description)
            </label>
            <textarea
              rows={3}
              placeholder="পণ্যের ফিচার, ব্যাটারি ব্যাকআপ, ওয়্যারেন্টি ও স্পেসিফিকেশন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              {productToEdit ? 'আপডেট করুন' : 'পণ্য যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
