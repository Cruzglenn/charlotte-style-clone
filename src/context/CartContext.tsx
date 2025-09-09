import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartItem, Product } from '@/types/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CartContextType {
  cartItems: CartItem[];
  cart: CartItem[]; // Alias for compatibility
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, size: string, quantity?: number, color?: string) => Promise<void>;
  updateCartItem: (productId: string, size: string, quantity: number, color?: string) => Promise<void>;
  removeFromCart: (productId: string, size: string, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: (products: Product[]) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const cart = useCart(user?.uid || '');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time cart updates
  useEffect(() => {
    if (!user?.uid) {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);
      
      // Listen for localStorage changes
      const handleStorageChange = () => {
        const updatedCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        setCartItems(updatedCart);
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    const cartRef = doc(db, 'carts', user.uid);
    const unsubscribe = onSnapshot(cartRef, (doc) => {
      if (doc.exists()) {
        const cartData = doc.data();
        setCartItems(cartData.items || []);
      } else {
        setCartItems([]);
      }
    });

    return unsubscribe;
  }, [user?.uid]);

  const addToCart = async (productId: string, size: string, quantity = 1, color?: string) => {
    // Allow adding to cart without login - use localStorage for guest users
    if (!user) {
      // For guest users, store cart in localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = guestCart.findIndex((item: any) => 
        item.productId === productId && item.size === size && item.color === color
      );
      
      if (existingItemIndex >= 0) {
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        guestCart.push({ productId, size, quantity, color });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCartItems(guestCart);
      return;
    }
    
    setIsLoading(true);
    try {
      await cart.addToCart(productId, size, quantity, color);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId: string, size: string, quantity: number, color?: string) => {
    if (!user) {
      // Update guest cart in localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const itemIndex = guestCart.findIndex((item: any) => 
        item.productId === productId && item.size === size && item.color === color
      );
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          guestCart.splice(itemIndex, 1);
        } else {
          guestCart[itemIndex].quantity = quantity;
        }
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        setCartItems(guestCart);
      }
      return;
    }
    
    setIsLoading(true);
    try {
      await cart.updateCartItem(productId, size, quantity, color);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string, color?: string) => {
    if (!user) {
      // Remove from guest cart in localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const filteredCart = guestCart.filter((item: any) => 
        !(item.productId === productId && item.size === size && item.color === color)
      );
      localStorage.setItem('guestCart', JSON.stringify(filteredCart));
      setCartItems(filteredCart);
      return;
    }
    
    setIsLoading(true);
    try {
      await cart.removeFromCart(productId, size, color);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Clear guest cart from localStorage
      localStorage.removeItem('guestCart');
      setCartItems([]);
      return;
    }
    
    setIsLoading(true);
    try {
      await cart.clearCart();
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = (products: Product[]) => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cart: cartItems, // Alias for compatibility
      cartCount,
      isLoading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
