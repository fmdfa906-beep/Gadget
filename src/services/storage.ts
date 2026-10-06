import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, Category, Order, ShopSettings, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../data/initialProducts';

// Helper to normalize product document from Firestore
function mapProductDoc(id: string, data: any): Product {
  const img = data.image || data.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  return {
    id,
    name: data.name || '',
    description: data.description || '',
    image: img,
    imageUrl: img,
    regularPrice: Number(data.regularPrice || 0),
    salePrice: Number(data.salePrice || 0),
    stock: Number(data.stock ?? 0),
    category: data.category || 'Other Gadgets',
    createdAt: data.createdAt || new Date().toISOString(),
    isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : (Number(data.stock ?? 0) > 0),
    badge: data.badge || undefined,
    rating: data.rating || 4.9,
    reviewsCount: data.reviewsCount || 25,
    updatedAt: data.updatedAt
  };
}

// Helper to normalize order document from Firestore
function mapOrderDoc(id: string, data: any): Order {
  const orderId = data.orderId || id;
  const phone = data.phone || data.mobileNumber || '';
  const address = data.address || data.fullAddress || '';
  const rawProducts = data.products || data.items || [];
  const status: OrderStatus = (data.orderStatus || data.status || 'Pending') as OrderStatus;
  
  const mappedProducts = rawProducts.map((p: any) => ({
    productId: p.productId || '',
    name: p.name || '',
    price: Number(p.price || 0),
    quantity: Number(p.quantity || 1),
    image: p.image || p.imageUrl || '',
    imageUrl: p.imageUrl || p.image || ''
  }));

  return {
    id,
    orderId,
    customerName: data.customerName || '',
    phone,
    mobileNumber: phone,
    address,
    fullAddress: address,
    district: data.district || 'Dhaka',
    note: data.note || undefined,
    products: mappedProducts,
    items: mappedProducts,
    subtotal: Number(data.subtotal || 0),
    deliveryCharge: Number(data.deliveryCharge || 0),
    totalAmount: Number(data.totalAmount || 0),
    paymentMethod: 'Cash on Delivery',
    orderStatus: status,
    status: status,
    createdAt: data.createdAt || new Date().toISOString()
  };
}

// Optional local initialization helper
export function initializeLocalData(): void {
  // Cloud Firestore is the main database
}

// ---------------- PRODUCTS ---------------- //

export async function fetchProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => mapProductDoc(d.id, d.data()));
    }
    // Seed database if currently empty
    await seedFirestoreWithInitialData();
    return INITIAL_PRODUCTS;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  const path = 'products';
  try {
    const colRef = collection(db, path);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const prods = snapshot.docs.map(d => mapProductDoc(d.id, d.data()));
        callback(prods);
      } else {
        // If empty on first snapshot, seed products
        seedFirestoreWithInitialData().then(() => {
          callback(INITIAL_PRODUCTS);
        });
      }
    }, (error) => {
      console.warn('Firestore products onSnapshot error:', error);
      callback(INITIAL_PRODUCTS);
    });
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const docRef = doc(db, 'products', product.id);
    const payload = {
      name: product.name,
      description: product.description,
      image: product.image || product.imageUrl,
      imageUrl: product.imageUrl || product.image,
      regularPrice: Number(product.regularPrice),
      salePrice: Number(product.salePrice),
      stock: Number(product.stock),
      category: product.category,
      isAvailable: Boolean(product.isAvailable && product.stock > 0),
      badge: product.badge || null,
      rating: product.rating || 4.9,
      reviewsCount: product.reviewsCount || 1,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- ORDERS ---------------- //

export async function fetchOrders(): Promise<Order[]> {
  const path = 'orders';
  try {
    const colRef = collection(db, path);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => mapOrderDoc(d.id, d.data()));
  } catch (error) {
    // If index is building or permissions, try unconstrained getDocs
    try {
      const snapshot = await getDocs(collection(db, path));
      const list = snapshot.docs.map(d => mapOrderDoc(d.id, d.data()));
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }
}

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  const path = 'orders';
  try {
    const colRef = collection(db, path);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const orders = snapshot.docs.map(d => mapOrderDoc(d.id, d.data()));
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    }, (error) => {
      console.warn('Firestore orders onSnapshot error:', error);
      callback([]);
    });
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createOrder(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const docRef = doc(db, 'orders', order.id);
    const payload = {
      orderId: order.orderId || order.id,
      customerName: order.customerName,
      phone: order.phone || order.mobileNumber,
      mobileNumber: order.mobileNumber || order.phone,
      address: order.address || order.fullAddress,
      fullAddress: order.fullAddress || order.address,
      district: order.district,
      note: order.note || '',
      products: order.products || order.items,
      items: order.items || order.products,
      subtotal: Number(order.subtotal),
      deliveryCharge: Number(order.deliveryCharge),
      totalAmount: Number(order.totalAmount),
      paymentMethod: 'Cash on Delivery',
      orderStatus: order.orderStatus || order.status || 'Pending',
      status: order.status || order.orderStatus || 'Pending',
      createdAt: order.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      status: status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- CATEGORIES ---------------- //

export async function fetchCategories(): Promise<Category[]> {
  const path = 'categories';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    }
    return INITIAL_CATEGORIES;
  } catch (error) {
    console.warn('Error fetching categories from Firestore:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const path = 'categories';
  try {
    for (const cat of categories) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ---------------- SETTINGS ---------------- //

export async function fetchSettings(): Promise<ShopSettings> {
  const path = 'settings';
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'general'));
    if (docSnap.exists()) {
      return docSnap.data() as ShopSettings;
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    console.warn('Error fetching settings from Firestore:', error);
    return INITIAL_SETTINGS;
  }
}

export async function saveSettings(settings: ShopSettings): Promise<void> {
  const path = 'settings/general';
  try {
    await setDoc(doc(db, 'settings', 'general'), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Helper to seed initial products into Firestore
export async function seedFirestoreWithInitialData(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      batch.set(doc(db, 'products', prod.id), {
        name: prod.name,
        description: prod.description,
        image: prod.image || prod.imageUrl,
        imageUrl: prod.imageUrl || prod.image,
        regularPrice: prod.regularPrice,
        salePrice: prod.salePrice,
        stock: prod.stock,
        category: prod.category,
        isAvailable: prod.isAvailable,
        badge: prod.badge || null,
        rating: prod.rating || 4.9,
        reviewsCount: prod.reviewsCount || 25,
        createdAt: prod.createdAt
      });
    }
    for (const cat of INITIAL_CATEGORIES) {
      batch.set(doc(db, 'categories', cat.id), cat);
    }
    batch.set(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
    await batch.commit();
    console.log('Seeded initial products and settings to Firestore database successfully.');
  } catch (e) {
    console.warn('Could not seed Firestore (might already exist or permission pending):', e);
  }
}
