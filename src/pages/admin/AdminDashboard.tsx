import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, Product } from '@/types/firebase';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const recentOrders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        // Calculate total revenue from all orders
        const allOrdersQuery = query(collection(db, 'orders'));
        const allOrdersSnapshot = await getDocs(allOrdersQuery);
        const totalRevenue = allOrdersSnapshot.docs.reduce((sum, doc) => {
          const order = doc.data() as Order;
          return sum + order.total;
        }, 0);

        // Fetch products
        const productsQuery = query(collection(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => doc.data()) as Product[];
        
        // Calculate low stock products (less than 5 items in any size)
        const lowStockProducts = products.filter(product => {
          return Object.values(product.stock).some(stock => stock < 5);
        }).length;

        // Fetch customers
        const customersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer')
        );
        const customersSnapshot = await getDocs(customersQuery);

        setStats({
          totalOrders: allOrdersSnapshot.size,
          totalRevenue,
          totalProducts: productsSnapshot.size,
          totalCustomers: customersSnapshot.size,
          lowStockProducts,
          recentOrders
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/70">Welcome to your store management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 rounded-lg p-6 group hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 rounded-lg p-6 group hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 rounded-lg p-6 group hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 rounded-lg p-6 group hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Customers</p>
              <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-card border border-accent/30 rounded-lg p-4 shadow-card">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-accent mr-2" />
            <p className="text-white">
              <span className="font-semibold text-accent">{stats.lowStockProducts}</span> products are running low on stock
            </p>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card border-border shadow-card rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-card/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {order.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
