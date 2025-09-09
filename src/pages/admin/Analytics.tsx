import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, Product, UserProfile } from '@/types/firebase';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    topProducts: [],
    salesByMonth: [],
    ordersByStatus: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const daysAgo = parseInt(dateRange);
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      // Fetch all orders
      const ordersQuery = query(collection(db, 'orders'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      // Filter orders by date range
      const filteredOrders = allOrders.filter(order => {
        const orderDate = order.createdAt.toDate();
        return orderDate >= startDate;
      });

      // Calculate previous period for growth comparison
      const prevStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const prevOrders = allOrders.filter(order => {
        const orderDate = order.createdAt.toDate();
        return orderDate >= prevStartDate && orderDate < startDate;
      });

      // Calculate metrics
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = filteredOrders.length;
      const prevRevenue = prevOrders.reduce((sum, order) => sum + order.total, 0);
      const prevOrderCount = prevOrders.length;

      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const ordersGrowth = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;

      // Fetch customers
      const customersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'customer')
      );
      const customersSnapshot = await getDocs(customersQuery);
      const totalCustomers = customersSnapshot.size;

      // Fetch products
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const totalProducts = productsSnapshot.size;

      // Calculate top products
      const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};
      
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.productName,
              sales: 0,
              revenue: 0
            };
          }
          productSales[item.productId].sales += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate sales by month (last 6 months)
      const salesByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthOrders = allOrders.filter(order => {
          const orderDate = order.createdAt.toDate();
          return orderDate >= monthStart && orderDate <= monthEnd;
        });

        salesByMonth.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
          orders: monthOrders.length
        });
      }

      // Calculate orders by status
      const statusCounts: { [key: string]: number } = {};
      filteredOrders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });

      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueGrowth,
        ordersGrowth,
        topProducts,
        salesByMonth,
        ordersByStatus
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-white/70">Track your store's performance and key metrics</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-border bg-card text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(analytics.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                {analytics.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics.revenueGrowth)}
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Orders</p>
              <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
              <div className="flex items-center mt-1">
                {analytics.ordersGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${analytics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics.ordersGrowth)}
                </span>
              </div>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Customers</p>
              <p className="text-2xl font-bold text-white">{analytics.totalCustomers}</p>
              <p className="text-sm text-white/70 mt-1">Registered users</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Products</p>
              <p className="text-2xl font-bold text-white">{analytics.totalProducts}</p>
              <p className="text-sm text-white/70 mt-1">In catalog</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Sales Trend (Last 6 Months)</h3>
          <div className="space-y-4">
            {analytics.salesByMonth.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-white/50 mr-2" />
                  <span className="text-sm font-medium text-white">{month.month}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{formatCurrency(month.revenue)}</div>
                  <div className="text-xs text-white/70">{month.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border-border shadow-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Top Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{product.name}</div>
                    <div className="text-xs text-white/70">{product.sales} sold</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-card border-border shadow-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Order Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {analytics.ordersByStatus.map((status) => (
            <div key={status.status} className="text-center">
              <div className="text-2xl font-bold text-white">{status.count}</div>
              <div className="text-sm text-white/70 capitalize">{status.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Average Order Value */}
      <div className="bg-card border-border shadow-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {analytics.totalOrders > 0 
                ? formatCurrency(analytics.totalRevenue / analytics.totalOrders)
                : '$0.00'
              }
            </div>
            <div className="text-sm text-white/70">Average Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {analytics.totalCustomers > 0 
                ? (analytics.totalOrders / analytics.totalCustomers).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-sm text-white/70">Orders per Customer</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {((analytics.ordersByStatus.find(s => s.status === 'delivered')?.count || 0) / analytics.totalOrders * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-white/70">Fulfillment Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
