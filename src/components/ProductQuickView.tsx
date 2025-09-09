import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ZoomIn, Star } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "@/hooks/use-toast";
import VirtualTryOn from "@/components/VirtualTryOn";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductQuickViewProps {
  product: Product;
  children: React.ReactNode;
}

const ProductQuickView = ({ product, children }: ProductQuickViewProps) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Navy", "Charcoal"];
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&q=80",
  ];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <ZoomIn size={16} />
              </Button>
              
              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index ? "bg-primary w-6" : "bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h2 className="text-3xl font-bold font-heading mb-2">{product.name}</h2>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-gray-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(127 reviews)</span>
              </div>
              <p className="text-3xl font-bold text-white">₱{product.price.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Authentic streetwear piece that connects you to your heritage. 
                Premium quality fabric with modern cut and traditional inspiration.
              </p>

              {/* Color Selection */}
              <div>
                <h4 className="font-semibold mb-2">Color: {selectedColor}</h4>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        selectedColor === color ? "border-primary scale-110" : "border-muted-foreground/30"
                      } ${color === "Black" ? "bg-black" : color === "White" ? "bg-white" : color === "Navy" ? "bg-gray-800" : "bg-gray-600"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Size: {selectedSize}</h4>
                  <Button variant="link" className="text-primary p-0 h-auto">
                    Size Guide
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-lg transition-all duration-300 font-semibold ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground py-3 font-semibold tracking-wide shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-neon/30 relative overflow-hidden group"
              >
                <span className="relative z-10">ADD TO CART - ₱{product.price.toLocaleString()}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={`flex-1 transition-all duration-300 ${
                    isWishlisted ? "bg-gray-500/10 border-gray-500 text-gray-500" : ""
                  }`}
                >
                  <Heart size={16} className={`mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
                
                <VirtualTryOn productName={product.name} productImage={product.image} />
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-2">Product Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 100% Premium Cotton</li>
                <li>• Heritage-inspired Design</li>
                <li>• Sustainable Production</li>
                <li>• Free Returns & Exchanges</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
