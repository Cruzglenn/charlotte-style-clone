import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-card border-l border-border w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading">YOUR CART</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            <AnimatePresence mode="wait">
              {items.length === 0 ? (
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
                    {items.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.size}`}
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
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                          layoutId={`image-${item.id}`}
                        />
                        
                        <div className="flex-1">
                          <motion.h3 
                            layout
                            className="font-semibold mb-1"
                          >
                            {item.name}
                          </motion.h3>
                          <p className="text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                          <p className="font-semibold text-white">₱{item.price}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
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
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
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
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-border pt-6 space-y-4">
              <motion.div 
                layout
                className="flex justify-between items-center text-xl font-bold"
              >
                <span>Total:</span>
                <motion.span className="text-white">
                  ₱<NumberFlow value={getTotalPrice()} format={{ minimumFractionDigits: 0 }} />
                </motion.span>
              </motion.div>
              
              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  CHECKOUT
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full"
                >
                  CLEAR CART
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;