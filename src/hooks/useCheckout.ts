import { collection, addDoc, doc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderItem, Address } from '@/types/firebase';

export const useCheckout = () => {
  const processOrder = async (
    userId: string,
    items: OrderItem[],
    shippingAddress: Address,
    paymentMethod: string
  ): Promise<string> => {
    if (!userId) throw new Error('User must be authenticated to place an order');
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Start a batch write
    const batch = writeBatch(db);
    
    // Create order document
    const orderRef = doc(collection(db, 'orders'));
    const orderData: Omit<Order, 'id'> = {
      userId,
      items,
      total,
      status: 'pending',
      shippingAddress,
      paymentMethod,
      createdAt: new Date() as any,
      updatedAt: new Date() as any
    };
    
    batch.set(orderRef, orderData);

    // Update product stock
    for (const item of items) {
      const productRef = doc(db, 'products', item.productId);
      batch.update(productRef, {
        [`stock.${item.size}`]: increment(-item.quantity)
      });
    }

    // Clear user's cart
    const cartRef = doc(db, 'carts', userId);
    batch.update(cartRef, { 
      items: [],
      updatedAt: new Date()
    });

    // Commit the batch
    await batch.commit();
    return orderRef.id;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
  };

  return { processOrder, updateOrderStatus };
};
