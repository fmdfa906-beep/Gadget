import React from 'react';
import { X, MessageCircle, Phone, MapPin, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useShop } from '../../context/ShopContext';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  Processing: 'bg-purple-100 text-purple-800 border-purple-300',
  Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-300'
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { changeOrderStatus, removeOrderItem } = useShop();

  if (!order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    changeOrderStatus(order.id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) {
      removeOrderItem(order.id);
      onClose();
    }
  };

  // WhatsApp link to directly message customer
  const cleanCustomerMobile = order.mobileNumber.replace(/[^0-9]/g, '');
  const formattedCustomerMobile = cleanCustomerMobile.startsWith('880')
    ? cleanCustomerMobile
    : cleanCustomerMobile.startsWith('0')
      ? `88${cleanCustomerMobile}`
      : `880${cleanCustomerMobile}`;

  const messageText = `আসসালামু আলাইকুম ${order.customerName}, Gadget Garden থেকে বলছি। আপনার অর্ডার (${order.id}) সংক্রান্ত বিষয়ে যোগাযোগ করছি।`;
  const whatsappUrl = `https://wa.me/${formattedCustomerMobile}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
              {order.id}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              অর্ডার বিস্তারিত
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Order Status Changer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">বর্তমান স্ট্যাটাস:</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
                <span className="text-xs text-slate-400">
                  তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">স্ট্যাটাস পরিবর্তন:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                গ্রাহকের তথ্য
              </h3>
              <div className="text-sm font-bold text-slate-900">{order.customerName}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${order.mobileNumber}`} className="hover:text-emerald-600 font-mono">
                  {order.mobileNumber}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>গ্রাহককে WhatsApp করুন</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ডেলিভারি ঠিকানা
              </h3>
              <div className="flex items-start gap-1.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">{order.district}</div>
                  <div className="mt-0.5 leading-relaxed">{order.fullAddress}</div>
                </div>
              </div>
              {order.note && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <strong>গ্রাহকের নোট:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              অর্ডারকৃত আইটেম তালিকা ({order.items.length})
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        ৳{item.price.toLocaleString('en-US')} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-900 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString('en-US')}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Footer */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>পণ্য উপমোট (Subtotal):</span>
                <span>৳{order.subtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>সর্বমোট সংগ্রহযোগ্য টাকা:</span>
                <span className="text-emerald-700">৳{order.totalAmount.toLocaleString('en-US')}</span>
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                পদ্ধতি: {order.paymentMethod}
              </div>
            </div>
          </div>

          {/* Delete Order Button */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>অর্ডার মুছে ফেলুন</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
