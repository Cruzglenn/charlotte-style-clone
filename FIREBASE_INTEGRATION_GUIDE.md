# 🔥 Deeply Rooted - Firebase Integration Guide

## Table of Contents
- [Firebase Free Tier Overview](#-firebase-free-tier-overview)
- [Project Setup](#-project-setup)
- [Authentication System](#-authentication-system)
- [Database Structure](#-database-structure)
- [Security Rules](#-security-rules)
- [Cart & Checkout](#-cart--checkout-system)
- [Admin Panel](#-admin-panel)
- [Deployment Guide](#-deployment-guide)
- [Performance Optimization](#-performance-optimization)
- [Troubleshooting](#-troubleshooting)

## 🔍 Firebase Free Tier Overview

### What's Included (FREE):
- **Authentication**: 10K phone auth/month, unlimited email/password
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB/day downloads
- **Hosting**: 10GB storage, 360MB/day transfer
- **Functions**: 125K invocations/month

### Capacity Estimates:
- ~1,600 orders/month
- ~50K product views/day
- Hundreds of concurrent users
- Full admin functionality

## 🛠 Project Setup

### 1. Install Dependencies
```bash
npm install firebase react-firebase-hooks @types/firebase
```

### 2. Firebase Configuration
Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 3. Environment Variables
Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🔐 Authentication System

### 1. Auth Hook (`src/hooks/useAuth.ts`)
```typescript
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result;
  };

  const login = (email: string, password: string) => 
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { user, loading, error, register, login, logout };
};
```

### 2. Auth Context (`src/context/AuthContext.tsx`)
```typescript
import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
```

## 🗄 Database Structure

### Collections Schema
```typescript
// src/types/firebase.ts

// User Profile
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  createdAt: Timestamp;
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
```

## 🔒 Security Rules

### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Orders are private to users and admins
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || isAdmin());
    }
    
    // Carts are private to users
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🛒 Cart & Checkout System

### 1. Cart Hook (`src/hooks/useCart.ts`)
```typescript
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export const useCart = (userId: string) => {
  const getCart = async () => {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    return cartDoc.exists() ? cartDoc.data() : { items: [] };
  };

  const addToCart = async (productId: string, size: string, quantity: number) => {
    const cartRef = doc(db, 'carts', userId);
    const cart = await getCart();
    
    const existingItem = cart.items.find(
      (item: any) => item.productId === productId && item.size === size
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, size, quantity });
    }
    
    await setDoc(cartRef, { 
      ...cart, 
      updatedAt: new Date() 
    }, { merge: true });
  };

  return { getCart, addToCart };
};
```

### 2. Checkout Process (`src/hooks/useCheckout.ts`)
```typescript
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export const useCheckout = () => {
  const processOrder = async (orderData: any) => {
    // 1. Start a batch write
    const batch = writeBatch(db);
    
    // 2. Create order document
    const orderRef = doc(collection(db, 'orders'));
    batch.set(orderRef, {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 3. Update product stock
    for (const item of orderData.items) {
      const productRef = doc(db, 'products', item.productId);
      batch.update(productRef, {
        [`stock.${item.size}`]: increment(-item.quantity)
      });
    }

    // 4. Clear user's cart
    const cartRef = doc(db, 'carts', orderData.userId);
    batch.update(cartRef, { items: [] });

    // 5. Commit the batch
    await batch.commit();
    return orderRef.id;
  };

  return { processOrder };
};
```

## 👨‍💼 Admin Panel

### 1. Order Management (`src/components/admin/OrderManagement.tsx`)
```tsx
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return unsubscribe;
  }, []);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date()
    });
  };

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderCard 
          key={order.id} 
          order={order}
          onStatusChange={updateStatus}
        />
      ))}
    </div>
  );
};
```

### 2. Product Management (`src/components/admin/ProductManagement.tsx`)
```tsx
import { collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore';

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Fetch products
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
  }, []);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date()
    });
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), {
      ...updates,
      updatedAt: new Date()
    });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <div className="space-y-6">
      <ProductForm onSubmit={handleAddProduct} />
      <ProductList 
        products={products}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};
```

## 🚀 Deployment Guide

### 1. Build Your Project
```bash
npm run build
```

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Initialize Firebase
```bash
firebase init
```
Select:
- Hosting
- Firestore
- Storage
- Use existing project

### 5. Deploy
```bash
firebase deploy
```

## ⚡ Performance Optimization

### 1. Data Fetching
```typescript
// Use pagination for large datasets
const usePaginatedProducts = (pageSize = 10) => {
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  const loadMore = async () => {
    let q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const newProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setProducts(prev => [...prev, ...newProducts]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  };
  
  return { products, loadMore };
};
```

### 2. Image Optimization
```typescript
// Use Firebase Storage with image resizing
const getOptimizedImageUrl = (path: string, width: number) => {
  const encodedPath = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/your-bucket/o/${encodedPath}?alt=media&width=${width}`;
};
```

## 🐛 Troubleshooting

### Common Issues:

1. **Missing Indexes**
   - Error: "The query requires an index..."
   - Solution: Click the link in the error message to create the missing index

2. **Permission Denied**
   - Check your Firestore security rules
   - Verify the user is authenticated when required
   - Ensure the user has the correct role for the operation

3. **Quota Exceeded**
   - Check your Firestore usage in the Firebase Console
   - Implement caching for frequently accessed data
   - Consider using local storage for cart data before checkout

4. **Slow Queries**
   - Add appropriate indexes
   - Limit the amount of data being queried
   - Use pagination for large datasets

## 📝 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon)
- [Firebase Caching Guide](https://firebase.google.com/docs/firestore/manage-data/enable-offline)

---

This guide provides a comprehensive overview of implementing Firebase in the Deeply Rooted e-commerce platform. For specific implementation details or additional features, refer to the Firebase documentation or contact the development team.
