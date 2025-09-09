import SmoothNavigation from "@/components/SmoothNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Package, Heart, Mail, Calendar, LogOut, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { AuthTest } from "@/components/AuthTest";
import { useAuthContext } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { AccountSettings } from "@/components/AccountSettings";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading, logout } = useAuthContext();
  const { orders } = useOrders(user?.uid);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    setProfileLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <SmoothNavigation />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">Loading...</div>
        </main>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        className="min-h-screen bg-background"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        <SmoothNavigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <User size={64} className="mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold font-heading mb-4">
                SIGN IN TO YOUR ACCOUNT
              </h1>
              <p className="text-muted-foreground">
                Access your orders, wishlist, and account settings
              </p>
            </div>

            <AuthTest />
          </div>
        </main>
      </motion.div>
    );
  }

  // This would show when user is logged in
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <SmoothNavigation />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">MY ACCOUNT</h1>
            <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center pb-4">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user?.displayName || 'User'}</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {userProfile?.role && (
                    <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                      {userProfile.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {userProfile.role.toUpperCase()}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'Recently'}</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card 
                    className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => navigate('/orders')}
                  >
                    <div className="flex flex-col h-full">
                      <Package className="mb-4 text-primary group-hover:scale-110 transition-transform" size={32} />
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Orders</h3>
                      <p className="text-muted-foreground text-sm flex-grow">View your order history and track packages</p>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <span className="text-sm font-medium text-primary">{orders.length} Orders</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group h-full opacity-60">
                    <div className="flex flex-col h-full">
                      <Heart className="mb-4 text-primary group-hover:scale-110 transition-transform" size={32} />
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Wishlist</h3>
                      <p className="text-muted-foreground text-sm flex-grow">Save items you want to purchase later</p>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">Coming Soon</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <AccountSettings 
                    userProfile={userProfile} 
                    onProfileUpdate={fetchUserProfile}
                  >
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group h-full">
                      <div className="flex flex-col h-full">
                        <Settings className="mb-4 text-primary group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Account Settings</h3>
                        <p className="text-muted-foreground text-sm flex-grow">Update your profile information and preferences</p>
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <span className="text-sm font-medium text-primary">Manage Account</span>
                        </div>
                      </div>
                    </Card>
                  </AccountSettings>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 md:mt-8"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{orders.length}</div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-sm text-muted-foreground">Wishlist Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">₱{orders.reduce((total, order) => total + order.total, 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{userProfile?.role === 'admin' ? 'Admin' : 'Customer'}</div>
                        <div className="text-sm text-muted-foreground">Account Type</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Profile;