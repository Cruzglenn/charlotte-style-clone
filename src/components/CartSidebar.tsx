import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

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
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={onClose} variant="outline">
                  CONTINUE SHOPPING
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-secondary/20 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                      <p className="font-semibold text-primary">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
              </div>
              
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