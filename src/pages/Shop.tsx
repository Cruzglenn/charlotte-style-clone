import SmoothNavigation from "@/components/SmoothNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { AddToCartAnimation } from "@/components/AddToCartAnimation";
import { motion } from "framer-motion";
import { useState } from "react";

const Shop = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});

  const products = [
    {
      id: 1,
      name: "MIDNIGHT TEE",
      price: 699,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      category: "ESSENTIALS",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "NEON NIGHTS",
      price: 699,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
      category: "LIMITED",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "STREET LEGEND",
      price: 699,
      image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=500&fit=crop",
      category: "BESTSELLER",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 4,
      name: "URBAN EXPLORER",
      price: 699,
      image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop",
      category: "NEW",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 5,
      name: "CITY VIBES",
      price: 699,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop",
      category: "ESSENTIALS",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 6,
      name: "UNDERGROUND",
      price: 699,
      image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop",
      category: "LIMITED",
      sizes: ["S", "M", "L", "XL"]
    }
  ];

  const handleSizeSelect = (productId: number, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    const selectedSize = selectedSizes[product.id] || "M";
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize
    });
  };

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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6">
            SHOP ALL
            <br />
            <span className="text-primary">COLLECTION</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium streetwear designed for the urban lifestyle. 
            Every piece tells a story.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {product.category}
                  </Badge>
                </div>

                {/* Quick Shop Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <AddToCartAnimation
                    productImage={product.image}
                    onAddToCart={() => handleAddToCart(product)}
                  >
                    <Button className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground">
                      ADD TO CART
                    </Button>
                  </AddToCartAnimation>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                <p className="text-2xl font-semibold text-white mb-4">₱{product.price}</p>
                
                {/* Size Options */}
                <div className="flex gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSizes[product.id] === size ? "default" : "outline"}
                      size="sm"
                      className={`w-10 h-10 p-0 transition-all duration-200 ${
                        selectedSizes[product.id] === size 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => handleSizeSelect(product.id, size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>

                <AddToCartAnimation
                  productImage={product.image}
                  onAddToCart={() => handleAddToCart(product)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    ADD TO CART
                  </Button>
                </AddToCartAnimation>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </motion.div>
  );
};

export default Shop;