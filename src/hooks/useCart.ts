import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cart, CartItem } from '@/types/firebase';

export const useCart = (userId: string) => {
  const getCart = async (): Promise<Cart> => {
    if (!userId) return { userId: '', items: [], updatedAt: new Date() as any };
    
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    
    if (cartDoc.exists()) {
      return cartDoc.data() as Cart;
    } else {
      // Create empty cart if it doesn't exist
      const emptyCart: Cart = {
        userId,
        items: [],
        updatedAt: new Date() as any
      };
      await setDoc(cartRef, emptyCart);
      return emptyCart;
    }
  };

  const addToCart = async (productId: string, size: string, quantity: number, color?: string) => {
    if (!userId) throw new Error('User must be authenticated to add items to cart');
    
    const cart = await getCart();
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = { productId, size, quantity, color };
      cart.items.push(newItem);
    }
    
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { 
      ...cart, 
      updatedAt: new Date() 
    }, { merge: true });
  };

  const updateCartItem = async (productId: string, size: string, quantity: number, color?: string) => {
    if (!userId) throw new Error('User must be authenticated to update cart');
    
    const cart = await getCart();
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
      
      const cartRef = doc(db, 'carts', userId);
      await setDoc(cartRef, { 
        ...cart, 
        updatedAt: new Date() 
      }, { merge: true });
    }
  };

  const removeFromCart = async (productId: string, size: string, color?: string) => {
    if (!userId) throw new Error('User must be authenticated to remove items from cart');
    
    const cart = await getCart();
    cart.items = cart.items.filter(
      (item) => !(item.productId === productId && item.size === size && item.color === color)
    );
    
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { 
      ...cart, 
      updatedAt: new Date() 
    }, { merge: true });
  };

  const clearCart = async () => {
    if (!userId) throw new Error('User must be authenticated to clear cart');
    
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { 
      userId,
      items: [],
      updatedAt: new Date() 
    }, { merge: true });
  };

  return { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  };
};
