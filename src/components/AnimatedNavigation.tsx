import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchModal from "./SearchModal";
import CartSidebar from "./CartSidebar";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: 90 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <>
      <motion.nav 
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              variants={navVariants}
            >
              <motion.a 
                href="/" 
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative group"
                variants={linkVariants}
                whileHover="hover"
              >
                HOME
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a 
                href="/shop" 
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative group"
                variants={linkVariants}
                whileHover="hover"
              >
                SHOP
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              <motion.a 
                href="/collections" 
                className="text-sm font-medium hover:text-primary transition-all duration-300 relative group"
                variants={linkVariants}
                whileHover="hover"
              >
                COLLECTIONS
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Center Logo */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2"
              variants={logoVariants}
              whileHover="hover"
            >
              <a href="/" className="text-2xl font-bold font-heading tracking-wider hover:text-primary transition-all duration-300">
                <span className="text-white">DEEPLY</span> <span className="text-gray-400">ROOTED</span>
              </a>
            </motion.div>

            {/* Right Navigation */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={navVariants}
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Search size={20} />
                </Button>
              </motion.div>
              
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <a href="/profile">
                    <User size={20} />
                  </a>
                </Button>
              </motion.div>
              
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative hover:bg-white/10 hover:text-white transition-all duration-300"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart size={20} />
                  <AnimatePresence>
                    {getTotalItems() > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        {getTotalItems()}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="md:hidden py-4 space-y-4 border-t border-border overflow-hidden"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.a 
                  href="/" 
                  className="block text-sm font-medium hover:text-primary transition-all duration-300"
                  variants={mobileItemVariants}
                  whileHover={{ x: 10 }}
                >
                  HOME
                </motion.a>
                <motion.a 
                  href="/shop" 
                  className="block text-sm font-medium hover:text-primary transition-all duration-300"
                  variants={mobileItemVariants}
                  whileHover={{ x: 10 }}
                >
                  SHOP
                </motion.a>
                <motion.a 
                  href="/collections" 
                  className="block text-sm font-medium hover:text-primary transition-all duration-300"
                  variants={mobileItemVariants}
                  whileHover={{ x: 10 }}
                >
                  COLLECTIONS
                </motion.a>
                <motion.a 
                  href="/profile" 
                  className="block text-sm font-medium hover:text-primary transition-all duration-300"
                  variants={mobileItemVariants}
                  whileHover={{ x: 10 }}
                >
                  PROFILE
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default AnimatedNavigation;
