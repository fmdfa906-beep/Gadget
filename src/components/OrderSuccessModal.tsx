import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, X, Copy, Check, ShoppingBag, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const { completedOrder, closeOrderSuccess, settings, showToast } = useShop();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (completedOrder) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas is constrained
      }
    }
  }, [completedOrder]);

  if (!completedOrder) return null;

  // Format WhatsApp message
  const cleanWhatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedWhatsapp = cleanWhatsappNumber.startsWith('880') 
    ? cleanWhatsappNumber 
    : cleanWhatsappNumber.startsWith('0') 
      ? `88${cleanWhatsappNumber}` 
      : `880${cleanWhatsappNumber}`;

  const productsSummary = completedOrder.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name}\n   - Quantity: ${item.quantity}\n   - Price: ৳${item.price.toLocaleString('en-US')} (Subtotal: ৳${(item.price * item.quantity).toLocaleString('en-US')})`
    )
    .join('\n');

  const whatsappMessage = 
    `*Order Confirmation - ${settings.shopName}*\n\n` +
    `*Order ID:* ${completedOrder.orderId || completedOrder.id}\n` +
    `*Customer name:* ${completedOrder.customerName}\n` +
    `*Phone number:* ${completedOrder.phone || completedOrder.mobileNumber}\n` +
    `*Full address:* ${completedOrder.address || completedOrder.fullAddress}\n` +
    `*District:* ${completedOrder.district}\n` +
    (completedOrder.note ? `*Note:* ${completedOrder.note}\n` : '') +
    `\n*Products:*\n${productsSummary}\n\n` +
    `*Product subtotal:* ৳${completedOrder.subtotal.toLocaleString('en-US')}\n` +
    `*Delivery charge:* ৳${completedOrder.deliveryCharge}\n` +
    `*Final total:* ৳${completedOrder.totalAmount.toLocaleString('en-US')}\n` +
    `*Payment method:* ${completedOrder.paymentMethod}\n\n` +
    `দয়া করে আমার অর্ডারটি কনফার্ম করুন। ধন্যবাদ!`;

  const whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  const copyOrderId = () => {
    navigator.clipboard.writeText(completedOrder.id);
    setCopied(true);
    showToast('অর্ডার আইডি কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <button
            onClick={closeOrderSuccess}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">আপনার অর্ডার সফল হয়েছে!</h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Gadget Garden থেকে অর্ডার করার জন্য ধন্যবাদ
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Order ID Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">অর্ডার আইডি নম্বর:</span>
              <span className="text-sm font-black text-slate-900 tracking-wider font-mono">
                {completedOrder.id}
              </span>
            </div>
            <button
              onClick={copyOrderId}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>
          </div>

          {/* Delivery Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">ক্যাশ অন ডেলিভারি:</strong> আমাদের প্রতিনিধি আপনার ঠিকানায় পার্সেল পৌঁছে দেবে। পার্সেল চেক করে <strong>৳{completedOrder.totalAmount.toLocaleString('en-US')}</strong> টাকা পরিশোধ করবেন।
            </div>
          </div>

          {/* Order Brief */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex justify-between">
              <span>অর্ডারকৃত পণ্যসমূহ:</span>
              <span>{completedOrder.items.length} টি আইটেম</span>
            </div>

            <div className="space-y-1.5 divide-y divide-slate-100 max-h-32 overflow-y-auto">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex justify-between">
                  <span className="text-slate-800 font-medium truncate max-w-[240px]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString('en-US')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 font-medium">
              <div className="flex justify-between text-slate-500">
                <span>গ্রাহক:</span>
                <span className="text-slate-900">{completedOrder.customerName} ({completedOrder.mobileNumber})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ঠিকানা:</span>
                <span className="text-slate-900 text-right truncate max-w-[200px]">{completedOrder.fullAddress}, {completedOrder.district}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>সর্বমোট:</span>
                <span className="text-emerald-600">৳{completedOrder.totalAmount.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Order Button - High Priority */}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 active:scale-98 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>হোয়াটসঅ্যাপে অর্ডার পাঠান (দ্রুত কনফার্মেশন)</span>
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              হোয়াটসঅ্যাপে ক্লিক করলে সকল তথ্যসহ স্বয়ংক্রিয় মেসেজ তৈরি হয়ে যাবে
            </p>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={closeOrderSuccess}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors"
          >
            আরও পণ্য কিনুন
          </button>
        </div>
      </div>
    </div>
  );
};
