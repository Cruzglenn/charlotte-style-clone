import { ReactNode, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Tag,
  Menu,
  X,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Marketing', href: '/admin/marketing', icon: Tag },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { userProfile } = useUserRole();

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
        <motion.div 
          className="fixed inset-y-0 left-0 flex w-64 flex-col bg-card border-r border-border shadow-xl"
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          exit={{ x: -256 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border">
            <div className="text-xl font-bold font-heading tracking-wider">
              <span className="text-white">DEEPLY</span> <span className="text-white/70">ROOTED</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/shop"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-accent/10"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Store
            </Link>
            <div className="border-t border-border my-4"></div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-accent/10'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border shadow-lg">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
            <div className="text-xl font-bold font-heading tracking-wider">
              <span className="text-white">DEEPLY</span> <span className="text-white/70">ROOTED</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/shop"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-white/70 hover:text-white hover:bg-accent/10 hover:scale-105"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Store
            </Link>
            <div className="border-t border-border my-4"></div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-accent/10'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{userProfile?.displayName}</p>
                <p className="text-xs text-white/70">{userProfile?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-accent/10 rounded-lg transition-all duration-300"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-white/70 hover:text-white lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <div className="flex items-center gap-x-4">
                <span className="text-sm text-white/70">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </motion.div>
  );
};
