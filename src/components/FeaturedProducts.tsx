import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import { AddToCartAnimation } from "@/components/AddToCartAnimation";
import ProductQuickView from "@/components/ProductQuickView";

const FeaturedProducts = () => {
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 1,
      name: "HERITAGE TEE",
      price: 699,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      category: "ROOTS"
    },
    {
      id: 2,
      name: "ANCESTRAL FLOW",
      price: 699,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
      category: "LEGACY"
    },
    {
      id: 3,
      name: "CULTURE KEEPER",
      price: 699,
      image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=500&fit=crop",
      category: "TRADITION"
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "M"
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-5xl md:text-6xl font-bold font-heading mb-6">
            HERITAGE
            <br />
            <span className="text-primary animate-pulse-slow">COLLECTION</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animation-delay-300 animate-fade-up">
            Authentic pieces rooted in tradition, crafted for the modern soul. 
            Each design connects you to your heritage.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 stagger-animation">
          {products.map((product) => (
            <ProductQuickView key={product.id} product={product}>
              <Card className="group bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 overflow-hidden animate-fade-up hover:scale-[1.02] hover:-translate-y-2 cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-6 py-3 font-semibold tracking-wide shadow-neon transition-all duration-300 hover:scale-105 hover:shadow-neon/50 relative overflow-hidden group/btn">
                      <span className="relative z-10">QUICK VIEW</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                  <p className="text-2xl font-semibold text-white mb-4">₱{product.price}</p>
                  <AddToCartAnimation
                    productImage={product.image}
                    onAddToCart={() => handleAddToCart(product)}
                  >
                    <Button 
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground py-3 font-semibold tracking-wide shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-neon/30 relative overflow-hidden group"
                    >
                      <span className="relative z-10">ADD TO CART</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </AddToCartAnimation>
                </div>
              </Card>
            </ProductQuickView>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a href="/shop">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-primary-foreground px-12 py-6 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-neon/30 relative overflow-hidden group"
            >
              <span className="relative z-10">VIEW ALL PRODUCTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;