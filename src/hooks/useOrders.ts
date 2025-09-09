import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  doc,
  getDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/firebase';
import { useState, useEffect } from 'react';

export const useOrders = (userId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders (all orders for admin, user orders for customers)
  useEffect(() => {
    if (!userId) {
      // If no userId provided, don't fetch anything for regular users
      setLoading(false);
      return;
    }

    let q;
    
    if (userId) {
      // Fetch orders for specific user
      q = query(
        collection(db, 'orders'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Fetch all orders (for admin)
      q = query(
        collection(db, 'orders'), 
        orderBy('createdAt', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        return {
          id: orderDoc.id,
          ...orderDoc.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const createOrder = async (orderData: any) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return {
    orders,
    loading,
    getOrderById,
    getOrdersByStatus,
    createOrder
  };
};
