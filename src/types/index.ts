export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl: string;
  regularPrice: number;
  salePrice: number;
  stock: number;
  category: string;
  createdAt: string;
  isAvailable: boolean;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  iconName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  mobileNumber: string;
  address: string;
  fullAddress: string;
  district: string;
  note?: string;
  products: OrderItem[];
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery';
  orderStatus: OrderStatus;
  status: OrderStatus;
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  whatsappNumber: string;
  phoneContact: string;
  insideDhakaDelivery: number;
  outsideDhakaDelivery: number;
  shopDescription: string;
  address: string;
  announcement: string;
}
