import { Timestamp } from 'firebase/firestore';

// Address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// User Profile
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: Address;
  };
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: { [size: string]: number };
  featured: boolean;
  createdAt: Timestamp;
}

// Cart Item
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  color?: string;
}

// Order Item
export interface OrderItem extends CartItem {
  price: number;
  productName: string;
}

// Order
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Cart
export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}
