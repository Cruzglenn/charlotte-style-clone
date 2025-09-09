import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-midnight/50 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6 animate-fade-up">
            <div>
              <h3 className="text-3xl font-bold font-heading tracking-wider mb-4">
                <span className="text-white">DEEPLY</span>
                <br />
                <span className="text-black">
                  ROOTED
                </span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Authentic streetwear that connects you to your heritage. 
                Where tradition meets modern style.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Youtube size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 animate-fade-up animation-delay-150">
            <h4 className="text-xl font-bold font-heading">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <a href="/shop" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/collections" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Collections
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Contact
                </a>
              </li>
              <li>
                <a href="/size-guide" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6 animate-fade-up animation-delay-300">
            <h4 className="text-xl font-bold font-heading">CUSTOMER CARE</h4>
            <ul className="space-y-3">
              <li>
                <a href="/shipping" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6 animate-fade-up animation-delay-450">
            <h4 className="text-xl font-bold font-heading">STAY CONNECTED</h4>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Subscribe to get updates on new drops and exclusive offers.
              </p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-card/50 border-border focus:border-primary transition-all duration-300"
                />
                <Button 
                  className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-neon/30 relative overflow-hidden group"
                >
                  <span className="relative z-10">JOIN</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail size={16} />
                <span className="text-sm">hello@deeplyrooted.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone size={16} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin size={16} />
                <span className="text-sm">Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Deeply Rooted. All rights reserved. Made with ❤️ for the culture.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-card rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">VISA</span>
                </div>
                <div className="w-8 h-5 bg-card rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-8 h-5 bg-card rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-white text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="sm"
      >
        ↑
      </Button>
    </footer>
  );
};

export default Footer;
