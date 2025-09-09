import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, CheckCircle, Truck, Home } from 'lucide-react';
import SmoothNavigation from '@/components/SmoothNavigation';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { orders, loading } = useOrders(user?.uid);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'packed': return <Package className="h-4 w-4" />;
      case 'pickup': return <Truck className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <Home className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'preparing': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'packed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pickup': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const OrderTracking = ({ order }: { order: any }) => (
    <Card className="bg-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-white">Order Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.trackingSteps?.map((step: any, index: number) => (
            <div key={step.status} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-primary text-primary-foreground' : 'bg-gray-700 text-gray-400'
              }`}>
                {step.completed ? <CheckCircle className="h-4 w-4" /> : getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${step.completed ? 'text-white' : 'text-white/70'}`}>
                  {step.label}
                </p>
                {step.completed && step.timestamp && (
                  <p className="text-sm text-white/50">
                    {new Date(step.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              {index < order.trackingSteps.length - 1 && (
                <div className={`w-px h-8 ml-4 ${
                  step.completed ? 'bg-primary' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  if (loading) {
    return (
      <motion.div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/70">Loading orders...</div>
      </motion.div>
    );
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
              MY ORDERS
            </h1>
            <p className="text-white/70 text-lg">Track your orders and delivery status</p>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-card border-border shadow-card text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
                <p className="text-white/70 mb-6">Start shopping to see your orders here</p>
                <Button 
                  onClick={() => navigate('/shop')}
                  className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Orders List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
                {orders.map((order) => (
                  <Card 
                    key={order.id} 
                    className={`bg-card border-border shadow-card cursor-pointer transition-all duration-300 ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-white">Order #{order.id.slice(-8).toUpperCase()}</h3>
                          <p className="text-white/70 text-sm">
                            {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 2).map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{item.name}</p>
                              <p className="text-white/70 text-xs">
                                {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-white/70 text-sm">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Total</span>
                        <span className="font-bold text-white">₱{order.total.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Details & Tracking */}
              <div className="space-y-6">
                {selectedOrder ? (
                  <>
                    {/* Order Details */}
                    <Card className="bg-card border-border shadow-card">
                      <CardHeader>
                        <CardTitle className="text-white">Order Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Items</h4>
                          {selectedOrder.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center space-x-4 mb-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-white">{item.name}</p>
                                <p className="text-white/70 text-sm">
                                  Size: {item.size} {item.color && `• Color: ${item.color}`}
                                </p>
                                <p className="text-white/70 text-sm">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-white">
                                ₱{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border pt-4">
                          <h4 className="font-semibold text-white mb-2">Shipping Address</h4>
                          <div className="text-white/70 text-sm space-y-1">
                            <p className="font-medium text-white">{selectedOrder.shippingAddress.fullName}</p>
                            <p>{selectedOrder.shippingAddress.address}</p>
                            <p>
                              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}
                            </p>
                            <p>{selectedOrder.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                          <div className="flex justify-between text-white/70">
                            <span>Subtotal</span>
                            <span>₱{selectedOrder.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-white/70">
                            <span>Shipping</span>
                            <span>₱{selectedOrder.shipping.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xl font-bold text-white border-t border-border pt-2">
                            <span>Total</span>
                            <span>₱{selectedOrder.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Tracking */}
                    <OrderTracking order={selectedOrder} />
                  </>
                ) : (
                  <Card className="bg-card border-border shadow-card">
                    <CardContent className="text-center py-12">
                      <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Select an Order</h3>
                      <p className="text-white/70">Click on an order to view details and tracking information</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Orders;
