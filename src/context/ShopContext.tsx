import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, Order, ShopSettings, CartItem, OrderStatus } from '../types';
import { 
  fetchProducts, 
  subscribeToProducts, 
  saveProduct, 
  deleteProduct,
  fetchOrders, 
  subscribeToOrders, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder,
  fetchCategories, 
  saveCategories,
  fetchSettings, 
  saveSettings,
  initializeLocalData
} from '../services/storage';
import { auth, isFirebaseConfigured, signInAdminWithEmail, registerFirstAdmin, isUserAdmin, checkHasAdmins } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: ShopSettings;
  loading: boolean;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Modals & Navigation
  activeProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;

  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  completedOrder: Order | null;
  openOrderSuccess: (order: Order) => void;
  closeOrderSuccess: () => void;

  isAdminPanelOpen: boolean;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;

  isAdminLoginOpen: boolean;
  openAdminLogin: () => void;
  closeAdminLogin: () => void;

  // Admin Auth (Firebase Authentication)
  isAdminLoggedIn: boolean;
  adminUser: User | null;
  hasAdmins: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  setupFirstAdmin: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logoutAdmin: () => void;

  // Admin Actions
  addNewProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProductItem: (productId: string) => Promise<void>;
  changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  removeOrderItem: (orderId: string) => Promise<void>;
  saveShopSettings: (settings: ShopSettings) => Promise<void>;
  saveCategoriesList: (categories: Category[]) => Promise<void>;

  // Customer order
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;

  // Notification Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    shopName: 'Gadget Garden',
    whatsappNumber: '01742656445',
    phoneContact: '01742656445',
    insideDhakaDelivery: 70,
    outsideDhakaDelivery: 130,
    shopDescription: 'Gadget Garden - বাংলাদেশের বিশ্বস্ত গ্যাজেট শপ',
    address: 'ঢাকা, বাংলাদেশ',
    announcement: '🎉 সারা দেশে ক্যাশ অন ডেলিভারিতে অর্ডার করুন!'
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gadget_garden_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Gadgets');

  // Modals
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [hasAdmins, setHasAdmins] = useState<boolean>(true);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gadget_garden_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Initial data load and subscriptions
  useEffect(() => {
    initializeLocalData();

    // Check if admins exist
    checkHasAdmins().then(setHasAdmins);

    // Load initial snapshot
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
    fetchSettings().then(setSettings);
    fetchOrders().then(setOrders);

    // Subscribe to live products & orders
    const unsubProducts = subscribeToProducts((prods) => {
      setProducts(prods);
      setLoading(false);
    });

    const unsubOrders = subscribeToOrders((ords) => {
      setOrders(ords);
    });

    // Check Firebase Auth state & verify admin status
    if (auth) {
      const unsubAuth = onAuthStateChanged(auth, async (user) => {
        setAdminUser(user);
        if (user) {
          const verifiedAdmin = await isUserAdmin(user);
          if (verifiedAdmin) {
            setIsAdminLoggedIn(true);
            setHasAdmins(true);
          } else {
            setIsAdminLoggedIn(false);
          }
        } else {
          setIsAdminLoggedIn(false);
        }
      });
      return () => {
        unsubProducts();
        unsubOrders();
        unsubAuth();
      };
    }

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (!product.isAvailable || product.stock <= 0) {
      showToast('দুঃখিত, এই পণ্যটির স্টক বর্তমানে শেষ!', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`"${product.name.slice(0, 20)}..." কার্টে পরিমাণ আপডেট করা হয়েছে!`);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`"${product.name.slice(0, 20)}..." কার্টে যোগ করা হয়েছে!`);
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে', 'info');
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock || 999);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);

  // Modals
  const openProductDetail = (product: Product) => {
    setActiveProduct(product);
  };

  const closeProductDetail = () => {
    setActiveProduct(null);
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      showToast('আপনার কার্ট খালি! অনুগ্রহ করে আগে পণ্য নির্বাচন করুন।', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const openOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setIsCheckoutOpen(false);
  };

  const closeOrderSuccess = () => {
    setCompletedOrder(null);
  };

  const openAdminPanel = () => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
    } else {
      setIsAdminPanelOpen(true);
    }
  };

  const closeAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };

  const openAdminLogin = () => {
    setIsAdminLoginOpen(true);
  };

  const closeAdminLogin = () => {
    setIsAdminLoginOpen(false);
  };

  // Admin Auth Methods via Firebase Authentication
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      const user = await signInAdminWithEmail(email, pass);
      const isAdm = await isUserAdmin(user);
      if (isAdm) {
        setAdminUser(user);
        setIsAdminLoggedIn(true);
        setIsAdminLoginOpen(false);
        setIsAdminPanelOpen(true);
        showToast('এডমিন ড্যাশবোর্ডে সফলভাবে লগইন করেছেন!', 'success');
        return true;
      } else {
        showToast('দুঃখিত, এই একাউন্টটির এডমিন অনুমতি নেই!', 'error');
        await signOut(auth);
        return false;
      }
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      let errMsg = 'ভুল ইমেইল বা পাসওয়ার্ড!';
      if (err.code === 'auth/user-not-found') errMsg = 'এই ইমেইলে কোনো এডমিন একাউন্ট পাওয়া যায়নি!';
      if (err.code === 'auth/wrong-password') errMsg = 'ভুল পাসওয়ার্ড! পুনরায় চেষ্টা করুন।';
      if (err.code === 'auth/invalid-email') errMsg = 'সঠিক ইমেইল এড্রেস লিখুন।';
      if (err.code === 'auth/too-many-requests') errMsg = 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সাময়িক লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।';
      showToast(errMsg, 'error');
      return false;
    }
  };

  const setupFirstAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const user = await registerFirstAdmin(email, pass);
      setAdminUser(user);
      setIsAdminLoggedIn(true);
      setHasAdmins(true);
      setIsAdminLoginOpen(false);
      setIsAdminPanelOpen(true);
      showToast('আপনার প্রথম এডমিন একাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      return true;
    } catch (err: any) {
      console.error('First Admin Registration Error:', err);
      let errMsg = err.message || 'এডমিন একাউন্ট তৈরি করতে ব্যর্থ হয়েছে!';
      if (err.code === 'auth/email-already-in-use') errMsg = 'এই ইমেইলটি ইতিমধ্যেই ব্যবহৃত হচ্ছে! লগইন করুন।';
      if (err.code === 'auth/weak-password') errMsg = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!';
      showToast(errMsg, 'error');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!auth) {
      showToast('Firebase Auth কনফিগারেশনে সমস্যা!', 'error');
      return false;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const isAdm = await isUserAdmin(result.user);
        if (isAdm) {
          setAdminUser(result.user);
          setIsAdminLoggedIn(true);
          setHasAdmins(true);
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
          showToast(`স্বাগতম ${result.user.displayName || result.user.email}!`, 'success');
          return true;
        } else {
          showToast('এই গুগল একাউন্টটি এডমিন হিসেবে রেজিস্টার্ড নয়।', 'error');
          await signOut(auth);
          return false;
        }
      }
      return false;
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast('গুগল লগইনে সমস্যা হয়েছে: ' + (err.message || 'Error'), 'error');
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setIsAdminPanelOpen(false);
    showToast('এডমিন প্যানেল থেকে লগআউট হয়েছেন।', 'info');
  };

  // Place customer order
  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    // Generate unique readable order ID, e.g. GG-24901
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const orderId = `GG-${datePrefix}-${randomNum}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderId: orderId,
      phone: orderData.phone || orderData.mobileNumber,
      mobileNumber: orderData.mobileNumber || orderData.phone,
      address: orderData.address || orderData.fullAddress,
      fullAddress: orderData.fullAddress || orderData.address,
      products: orderData.products || orderData.items,
      items: orderData.items || orderData.products,
      orderStatus: 'Pending',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    await createOrder(newOrder);

    // Deduct stock for ordered products
    for (const item of newOrder.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        const updatedProd: Product = {
          ...product,
          stock: newStock,
          isAvailable: newStock > 0
        };
        await saveProduct(updatedProd);
      }
    }

    clearCart();
    openOrderSuccess(newOrder);
    return newOrder;
  };

  // Admin CRUD actions
  const addNewProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
    await saveProduct(product);
    showToast('নতুন পণ্য সফলভাবে ক্লাউড Firestore এ যোগ করা হয়েছে!');
  };

  const updateProduct = async (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    await saveProduct(product);
    showToast('পণ্যটি সফলভাবে আপডেট করা হয়েছে!');
  };

  const deleteProductItem = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await deleteProduct(productId);
    showToast('পণ্যটি সফলভাবে ডিলিট করা হয়েছে!', 'info');
  };

  const changeOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, orderStatus: status } : o))
    );
    await updateOrderStatus(orderId, status);
    showToast(`অর্ডার স্ট্যাটাস "${status}" এ পরিবর্তন করা হয়েছে!`);
  };

  const removeOrderItem = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    await deleteOrder(orderId);
    showToast('অর্ডারটি ডিলিট করা হয়েছে', 'info');
  };

  const saveShopSettings = async (newSettings: ShopSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
    showToast('শপ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const saveCategoriesList = async (cats: Category[]) => {
    setCategories(cats);
    await saveCategories(cats);
    showToast('ক্যাটাগরি তালিকা আপডেট করা হয়েছে!');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        loading,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeProduct,
        openProductDetail,
        closeProductDetail,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        completedOrder,
        openOrderSuccess,
        closeOrderSuccess,
        isAdminPanelOpen,
        openAdminPanel,
        closeAdminPanel,
        isAdminLoginOpen,
        openAdminLogin,
        closeAdminLogin,
        isAdminLoggedIn,
        adminUser,
        hasAdmins,
        loginWithEmail,
        setupFirstAdmin,
        loginWithGoogle,
        logoutAdmin,
        addNewProduct,
        updateProduct,
        deleteProductItem,
        changeOrderStatus,
        removeOrderItem,
        saveShopSettings,
        saveCategoriesList,
        placeOrder,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
