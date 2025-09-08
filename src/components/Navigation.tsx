import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm font-medium hover:text-primary transition-smooth">
              HOME
            </a>
            <a href="/shop" className="text-sm font-medium hover:text-primary transition-smooth">
              SHOP
            </a>
            <a href="/collections" className="text-sm font-medium hover:text-primary transition-smooth">
              COLLECTIONS
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </Button>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="text-2xl font-bold font-heading tracking-wider">
              YOUR BRAND
            </a>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="sm">
              <User size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <a href="/" className="block text-sm font-medium hover:text-primary transition-smooth">
              HOME
            </a>
            <a href="/shop" className="block text-sm font-medium hover:text-primary transition-smooth">
              SHOP
            </a>
            <a href="/collections" className="block text-sm font-medium hover:text-primary transition-smooth">
              COLLECTIONS
            </a>
            <a href="/support" className="block text-sm font-medium hover:text-primary transition-smooth">
              SUPPORT
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;