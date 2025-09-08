import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Settings, Package, Heart } from "lucide-react";

const Profile = () => {
  // This would normally check authentication status
  // For now, we'll show a login prompt
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
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

            <Card className="p-8 bg-card border-border">
              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  SIGN IN
                </Button>
                <Button variant="outline" className="w-full">
                  CREATE ACCOUNT
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact our support team
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // This would show when user is logged in
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-heading mb-8">MY ACCOUNT</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border hover:shadow-neon/20 transition-all cursor-pointer">
              <Package className="mb-4 text-primary" size={32} />
              <h3 className="text-xl font-semibold mb-2">Orders</h3>
              <p className="text-muted-foreground">View your order history and track packages</p>
            </Card>
            
            <Card className="p-6 bg-card border-border hover:shadow-neon/20 transition-all cursor-pointer">
              <Heart className="mb-4 text-primary" size={32} />
              <h3 className="text-xl font-semibold mb-2">Wishlist</h3>
              <p className="text-muted-foreground">Save items you want to purchase later</p>
            </Card>
            
            <Card className="p-6 bg-card border-border hover:shadow-neon/20 transition-all cursor-pointer">
              <Settings className="mb-4 text-primary" size={32} />
              <h3 className="text-xl font-semibold mb-2">Settings</h3>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;