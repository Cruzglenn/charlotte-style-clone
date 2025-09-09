import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartContext } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import SmoothNavigation from '@/components/SmoothNavigation';
import { Product, CartItem } from '@/types/firebase';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const { createOrder } = useOrders();
  const { products } = useProducts();
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrichedCart, setEnrichedCart] = useState<(CartItem & { name: string; price: number; image: string })[]>([]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: ''
  });

  // Enrich cart items with product details for guest users
  useEffect(() => {
    if (cart.length > 0 && products.length > 0) {
      const enriched = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          return {
            ...item,
            name: item.name || product.name,
            price: item.price || product.price,
            image: item.image || product.images[0] || '/placeholder.svg'
          };
        }
        return {
          ...item,
          name: item.name || 'Unknown Product',
          price: item.price || 0,
          image: item.image || '/placeholder.svg'
        };
      });
      setEnrichedCart(enriched);
    }
  }, [cart, products]);

  useEffect(() => {
    // Only redirect if cart is empty - allow guest checkout
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }
  }, [cart, navigate]);

  const subtotal = enrichedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150; // Fixed shipping fee
  const total = subtotal + shipping;

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is not logged in, redirect to login/signup
    if (!user) {
      navigate('/profile?redirect=checkout');
      return;
    }

    // Validate required fields
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone || 
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.province || 
        !shippingAddress.postalCode) {
      alert('Please fill in all required shipping information.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user.uid,
        items: enrichedCart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        shippingAddress,
        subtotal,
        shipping,
        total,
        status: 'pending',
        paymentMethod: 'cod', // Cash on Delivery
        trackingSteps: [
          { status: 'pending', label: 'Order Placed', completed: true, timestamp: new Date() },
          { status: 'confirmed', label: 'Order Confirmed', completed: false },
          { status: 'preparing', label: 'Preparing Order', completed: false },
          { status: 'packed', label: 'Order Packed', completed: false },
          { status: 'pickup', label: 'Ready for Pickup', completed: false },
          { status: 'shipped', label: 'Out for Delivery', completed: false },
          { status: 'delivered', label: 'Delivered', completed: false }
        ]
      };

      const orderId = await createOrder(orderData);
      console.log('Order created successfully:', orderId);
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SmoothNavigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              CHECKOUT
            </h1>
            <p className="text-white/70 text-lg">Complete your order</p>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">1</div>
                  <span className="ml-2 text-white">Shipping</span>
                </div>
                <div className="w-12 h-px bg-border"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-muted-foreground font-semibold">2</div>
                  <span className="ml-2 text-muted-foreground">Payment</span>
                </div>
                <div className="w-12 h-px bg-border"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-border rounded-full flex items-center justify-center text-muted-foreground font-semibold">3</div>
                  <span className="ml-2 text-muted-foreground">Confirmation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Shipping Information
                  </div>
                  {!user && (
                    <div className="text-sm text-muted-foreground">
                      Guest Checkout
                    </div>
                  )}
                </CardTitle>
                {!user && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-4">
                    <p className="text-sm text-white/80">
                      <strong>Shopping as guest?</strong> You can checkout without creating an account. 
                      <button 
                        onClick={() => navigate('/profile?redirect=checkout')}
                        className="text-primary hover:text-primary/80 ml-1 underline"
                      >
                        Sign in
                      </button> for faster checkout next time.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-white">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        placeholder="Enter your full name"
                        className="bg-background border-border text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        placeholder="Enter your phone number"
                        className="bg-background border-border text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="bg-background border-border text-white placeholder:text-white/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">Street Address</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      placeholder="Enter your complete street address"
                      className="bg-background border-border text-white placeholder:text-white/50"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-white">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                        className="bg-background border-border text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province" className="text-white">Province</Label>
                      <Input
                        id="province"
                        value={shippingAddress.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        required
                        placeholder="Enter your province"
                        className="bg-background border-border text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-white">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                        placeholder="Enter postal code"
                        className="bg-background border-border text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white">Delivery Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={shippingAddress.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      className="bg-background border-border text-white placeholder:text-white/50"
                      rows={2}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrichedCart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <p className="text-white/70 text-sm">
                          Size: {item.size} {item.color && `• Color: ${item.color}`}
                        </p>
                        <p className="text-white/70 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₱{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Shipping</span>
                      <span>₱{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white border-t border-border pt-2">
                      <span>Total</span>
                      <span>₱{total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-card border-border shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-semibold text-white">Cash on Delivery (COD)</p>
                        <p className="text-white/70 text-sm">Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold py-4 text-lg transition-all duration-300 h-14"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Place Order - ₱{total.toLocaleString()}</span>
                    {!user && <span className="text-sm opacity-80">(Login Required)</span>}
                  </div>
                )}
              </Button>
              
              {!user && (
                <p className="text-center text-sm text-white/60 mt-2">
                  You'll be redirected to login before completing your order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
