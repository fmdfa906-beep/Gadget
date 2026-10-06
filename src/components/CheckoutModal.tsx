import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshDistricts';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cart, 
    cartSubtotal, 
    settings, 
    placeOrder, 
    showToast 
  } = useShop();

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [fullAddress, setFullAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Determine delivery charge based on selected district
  const selectedDistrictObj = BANGLADESH_DISTRICTS.find((d) => d.name === district);
  const isInsideDhaka = selectedDistrictObj ? selectedDistrictObj.isDhaka : district === 'Dhaka';
  const deliveryCharge = isInsideDhaka ? settings.insideDhakaDelivery : settings.outsideDhakaDelivery;
  const totalAmount = cartSubtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanName = customerName.trim();
    const cleanMobile = mobileNumber.replace(/\s+/g, '');
    const cleanAddress = fullAddress.trim();

    if (!cleanName) {
      showToast('অনুগ্রহ করে আপনার নাম লিখুন।', 'error');
      return;
    }

    // BD Phone validation: 11 digits starting with 01
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanMobile)) {
      showToast('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)', 'error');
      return;
    }

    if (!cleanAddress || cleanAddress.length < 5) {
      showToast('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন।', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('কার্টে কোনো পণ্য নেই!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.salePrice,
        quantity: item.quantity,
        image: item.product.image || item.product.imageUrl,
        imageUrl: item.product.imageUrl || item.product.image
      }));

      await placeOrder({
        orderId: '', // auto-generated in context
        customerName: cleanName,
        phone: cleanMobile,
        mobileNumber: cleanMobile,
        district: selectedDistrictObj?.nameBn || district,
        address: `${cleanAddress}, ${selectedDistrictObj?.nameBn || district}`,
        fullAddress: cleanAddress,
        note: note.trim() || undefined,
        products: orderItems,
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge,
        totalAmount,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Pending'
      });
    } catch (err) {
      console.error('Order submission error:', err);
      showToast('অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={closeCheckout}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              ক্যাশ অন ডেলিভারি অর্ডার ফরম
            </h2>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Trust Banner */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>ক্যাশ অন ডেলিভারি:</strong> অর্ডার করার জন্য কোনো অগ্রিম টাকা দিতে হবে না। পার্সেল হাতে পেয়ে মূল্য পরিশোধ করুন।
            </span>
          </div>

          {/* Customer Details Inputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              আপনার ডেলিভারি তথ্য
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোবাইল নম্বর <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX বা 018XXXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                অর্ডার নিশ্চিত করার জন্য এই নম্বরে কল বা মেসেজ দেওয়া হতে পারে
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জেলা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <optgroup label="ঢাকা অঞ্চল">
                    {BANGLADESH_DISTRICTS.filter((d) => d.division === 'Dhaka').map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.nameBn} ({d.isDhaka ? `৳${settings.insideDhakaDelivery}` : `৳${settings.outsideDhakaDelivery}`})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="অন্যান্য জেলাসমূহ">
                    {BANGLADESH_DISTRICTS.filter((d) => d.division !== 'Dhaka').map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.nameBn} (৳{settings.outsideDhakaDelivery})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ডেলিভারি চার্জ
                </label>
                <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-emerald-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    {isInsideDhaka ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}
                  </span>
                  <span>৳{deliveryCharge}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পূর্ণ ঠিকানা (থানা, এলাকা, রোড, বাড়ি নম্বর) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="যেমন: বাড়ি ১২, রোড ৫, সেক্টর ৩, উত্তরা, ঢাকা"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: কালার বা ডেলিভারি সময় সংক্রান্ত কোনো তথ্য"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Order Summary Table */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              অর্ডার সারাংশ ({cart.length} টি পণ্য)
            </h3>

            <div className="space-y-2 max-h-36 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-8 h-8 rounded object-cover bg-white shrink-0"
                    />
                    <span className="truncate text-slate-800 font-medium">
                      {item.product.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ৳{(item.product.salePrice * item.quantity).toLocaleString('en-US')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>পণ্য উপমোট (Subtotal):</span>
                <span>৳{cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-200">
                <span>সর্বমোট প্রদেয় টাকা:</span>
                <span className="text-emerald-600">৳{totalAmount.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>অর্ডার তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
