import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Truck, 
  Search,
  MessageCircle,
  Database
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, Order, Category, OrderStatus } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { SettingsTab } from './SettingsTab';

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminPanelOpen, 
    closeAdminPanel, 
    logoutAdmin, 
    products, 
    orders, 
    categories, 
    deleteProductItem, 
    updateProduct,
    saveCategoriesList,
    settings,
    showToast 
  } = useShop();

  const [currentTab, setCurrentTab] = useState<AdminTab>('products');

  // Modals state
  const [isProductFormOpen, setIsProductFormOpen] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Products Filter in Admin
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminProductCategory, setAdminProductCategory] = useState('All');

  // Category Management Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatBn, setNewCatBn] = useState('');

  if (!isAdminPanelOpen) return null;

  // Overview Stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesQuery = 
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.mobileNumber.includes(orderSearchQuery) ||
      order.district.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesCat = adminProductCategory === 'All' || prod.category === adminProductCategory;
    const matchesQuery = prod.name.toLowerCase().includes(adminProductSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatBn.trim()) {
      showToast('ক্যাটাগরির নাম দিন', 'error');
      return;
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      banglaName: newCatBn.trim()
    };
    await saveCategoriesList([...categories, newCat]);
    setNewCatName('');
    setNewCatBn('');
    showToast('নতুন ক্যাটাগরি তৈরি হয়েছে!');
  };

  const handleDeleteCategory = async (catId: string) => {
    if (categories.length <= 1) {
      showToast('কমপক্ষে একটি ক্যাটাগরি থাকতে হবে', 'error');
      return;
    }
    if (window.confirm('আপনি কি এই ক্যাটাগরিটি মুছে ফেলতে চান?')) {
      const updated = categories.filter((c) => c.id !== catId);
      await saveCategoriesList(updated);
      showToast('ক্যাটাগরি মুছে ফেলা হয়েছে', 'info');
    }
  };

  const handleToggleProductStatus = async (prod: Product) => {
    await updateProduct({
      ...prod,
      isAvailable: !prod.isAvailable
    });
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductFormOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="w-full max-w-6xl h-[95vh] bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
              GG
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                {settings.shopName} - এডমিন ড্যাশবোর্ড
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono">
                Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
            <button
              onClick={closeAdminPanel}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                currentTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ওভারভিউ</span>
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                currentTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Products ({products.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 relative ${
                currentTab === 'orders'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manage Orders</span>
              {pendingOrders > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                currentTab === 'categories'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                currentTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Quick Add Product Trigger */}
          <button
            onClick={openNewProductModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-600 mb-1.5">
                    <span className="text-xs font-bold text-slate-500">মোট বিক্রয় (৳)</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    ৳{totalRevenue.toLocaleString('en-US')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">ক্যাশ অন ডেলিভারি সহ</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-blue-600 mb-1.5">
                    <span className="text-xs font-bold text-slate-500">মোট অর্ডার</span>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">সর্বমোট গ্রাহক অর্ডার</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-amber-500 mb-1.5">
                    <span className="text-xs font-bold text-slate-500">পেন্ডিং অর্ডার</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600">
                    {pendingOrders}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">অপেক্ষমান অর্ডার</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-purple-600 mb-1.5">
                    <span className="text-xs font-bold text-slate-500">মোট পণ্য সংখ্যা</span>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {products.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">লাইভ স্টোরে প্রদর্শিত</div>
                </div>
              </div>

              {/* Quick Actions & Low Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Orders Overview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">সাম্প্রতিক অর্ডারসমূহ</h3>
                    <button
                      onClick={() => setCurrentTab('orders')}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                    >
                      সকল অর্ডার দেখুন &rarr;
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-xs text-slate-400 py-6 text-center">
                      এখনও কোনো অর্ডার আসেনি।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{order.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{order.id} • {order.district}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-700 block">৳{order.totalAmount.toLocaleString('en-US')}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-medium">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Low Stock Warning Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>কম স্টক সতর্কবার্তা</span>
                    </h3>
                    <button
                      onClick={openNewProductModal}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন পণ্য যোগ</span>
                    </button>
                  </div>
                  {lowStockProducts.length === 0 ? (
                    <div className="text-xs text-slate-400 py-6 text-center">
                      সব পণ্যের পর্যাপ্ত স্টক রয়েছে।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lowStockProducts.slice(0, 5).map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/50 flex items-center justify-between text-xs"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-slate-900 truncate block">{prod.name}</span>
                            <span className="text-[10px] text-slate-500">{prod.category}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              prod.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {prod.stock === 0 ? 'স্টক শূন্য' : `স্টক: ${prod.stock} টি`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {currentTab === 'orders' && (
            <div className="space-y-4">
              {/* Search & Status Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="অর্ডার আইডি, গ্রাহক বা ফোন নম্বর..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                        <tr>
                          <th className="p-3">অর্ডার আইডি</th>
                          <th className="p-3">গ্রাহক ও মোবাইল</th>
                          <th className="p-3">জেলা</th>
                          <th className="p-3">আইটেম সংখ্যা</th>
                          <th className="p-3">সর্বমোট</th>
                          <th className="p-3">স্ট্যাটাস</th>
                          <th className="p-3 text-right">একশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              {order.id}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{order.customerName}</div>
                              <div className="text-slate-500 font-mono text-[11px]">{order.mobileNumber}</div>
                            </td>
                            <td className="p-3 text-slate-600">
                              {order.district}
                            </td>
                            <td className="p-3 text-slate-600">
                              {order.items.reduce((s, i) => s + i.quantity, 0)} টি
                            </td>
                            <td className="p-3 font-bold text-emerald-700">
                              ৳{order.totalAmount.toLocaleString('en-US')}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                              >
                                বিস্তারিত
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {currentTab === 'products' && (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={adminProductSearch}
                      onChange={(e) => setAdminProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={adminProductCategory}
                    onChange={(e) => setAdminProductCategory(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
                  >
                    <option value="All">সকল ক্যাটাগরি</option>
                    {categories.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.banglaName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={openNewProductModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
              </div>

              {/* Products Grid / Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="p-3">ছবি</th>
                        <th className="p-3">পণ্যের নাম</th>
                        <th className="p-3">ক্যাটাগরি</th>
                        <th className="p-3">বিক্রয় মূল্য</th>
                        <th className="p-3">স্টক</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3 text-right">একশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 max-w-xs truncate">{prod.name}</div>
                            {prod.badge && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                                {prod.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600">
                            {prod.category}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-emerald-700">৳{prod.salePrice.toLocaleString('en-US')}</span>
                            {prod.regularPrice > prod.salePrice && (
                              <span className="text-[11px] text-slate-400 line-through ml-1.5">
                                ৳{prod.regularPrice.toLocaleString('en-US')}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {prod.stock} টি
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleProductStatus(prod)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                prod.isAvailable && prod.stock > 0
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : 'bg-red-50 text-red-700 border-red-300'
                              }`}
                            >
                              {prod.isAvailable && prod.stock > 0 ? 'স্টকে আছে' : 'স্টক শেষ'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`আপনি কি "${prod.name}" ডিলিট করতে চান?`)) {
                                    deleteProductItem(prod.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {currentTab === 'categories' && (
            <div className="space-y-6">
              {/* Add Category Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">নতুন ক্যাটাগরি যোগ করুন</h3>
                <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="ইংরেজি নাম (যেমন: Smart Watch)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="বাংলা নাম (যেমন: স্মার্ট ওয়াচ)"
                    value={newCatBn}
                    onChange={(e) => setNewCatBn(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    ক্যাটাগরি তৈরি করুন
                  </button>
                </form>
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                  বর্তমান ক্যাটাগরি তালিকা ({categories.length})
                </div>
                <div className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{cat.banglaName}</span>
                        <span className="text-slate-400 ml-2 font-mono text-[11px]">({cat.name})</span>
                      </div>
                      {cat.id !== 'all' && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {currentTab === 'settings' && <SettingsTab />}

        </div>

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          productToEdit={editingProduct}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};
