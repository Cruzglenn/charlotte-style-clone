import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cartItems, updateCartItem, removeFromCart, clearCart, getCartTotal, isLoading } = useCartContext();
  const { products } = useProducts();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-card border-l border-border w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading">YOUR CART</SheetTitle>
        </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6 min-h-0">
            <AnimatePresence mode="wait">
              {cartItems.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button onClick={onClose} variant="outline">
                    CONTINUE SHOPPING
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="items"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {cartItems.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      
                      return (
                        <motion.div 
                          key={`${item.productId}-${item.size}-${item.color}`}
                          layout
                          initial={{ opacity: 0, scale: 0.96, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: -20 }}
                          transition={{
                            opacity: { duration: 0.2 },
                            layout: { duration: 0.3, ease: "easeInOut" },
                          }}
                          className="flex gap-4 p-4 bg-secondary/20 rounded-lg"
                        >
                          <motion.img
                            src={product.images?.[0] || '/placeholder.svg'}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                            layoutId={`image-${item.productId}`}
                          />
                          
                          <div className="flex-1">
                            <motion.h3 
                              layout
                              className="font-semibold mb-1"
                            >
                              {product.name}
                            </motion.h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              Size: {item.size}
                              {item.color && ` • Color: ${item.color}`}
                            </p>
                            <p className="font-semibold">₱{product.price.toLocaleString()}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartItem(item.productId, item.size, item.quantity - 1, item.color)}
                                  className="w-8 h-8 p-0"
                                  disabled={isLoading}
                                >
                                  <Minus size={12} />
                                </Button>
                              </motion.div>
                              <motion.span 
                                layout
                                className="w-8 text-center font-medium"
                              >
                                <NumberFlow value={item.quantity} />
                              </motion.span>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartItem(item.productId, item.size, item.quantity + 1, item.color)}
                                  className="w-8 h-8 p-0"
                                  disabled={isLoading}
                                >
                                  <Plus size={12} />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                          
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.productId, item.size, item.color)}
                              className="text-destructive hover:text-destructive"
                              disabled={isLoading}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-border pt-6 space-y-4 mt-auto">
              <motion.div 
                layout
                className="flex justify-between items-center text-xl font-bold"
              >
                <span>Total:</span>
                <motion.span>
                  ₱<NumberFlow value={getCartTotal(products)} format={{ minimumFractionDigits: 0 }} />
                </motion.span>
              </motion.div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                >
                  CHECKOUT
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full h-10"
                  disabled={isLoading}
                >
                  CLEAR CART
                </Button>
              </div>
            </div>
          )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;