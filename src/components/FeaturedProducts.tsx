import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "MIDNIGHT TEE",
      price: "$45",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      category: "ESSENTIALS"
    },
    {
      id: 2,
      name: "NEON NIGHTS",
      price: "$55",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
      category: "LIMITED"
    },
    {
      id: 3,
      name: "STREET LEGEND",
      price: "$50",
      image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=400&h=500&fit=crop",
      category: "BESTSELLER"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold font-heading mb-6">
            FEATURED
            <br />
            <span className="text-primary">DROPS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated pieces that define the urban aesthetic. 
            Each design tells a story of street culture.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Quick Shop Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant="outline" 
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background"
                  >
                    QUICK SHOP
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">{product.name}</h3>
                <p className="text-2xl font-semibold text-primary">{product.price}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 py-6 text-lg font-semibold"
          >
            VIEW ALL PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;