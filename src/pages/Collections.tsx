import SmoothNavigation from "@/components/SmoothNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShirtCollectionDemo } from "@/components/ShirtCollectionDemo";
import { motion } from "framer-motion";

const Collections = () => {
  const collections = [
    {
      id: 1,
      name: "ESSENTIALS",
      description: "Core pieces for everyday urban style",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      itemCount: 12
    },
    {
      id: 2,
      name: "LIMITED EDITION",
      description: "Exclusive drops with unique designs",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
      itemCount: 8
    },
    {
      id: 3,
      name: "UNDERGROUND",
      description: "Raw street culture aesthetics",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop",
      itemCount: 15
    },
    {
      id: 4,
      name: "NEON NIGHTS",
      description: "Vibrant designs for the night scene",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      itemCount: 10
    }
  ];

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
            OUR
            <br />
            <span className="text-primary">COLLECTIONS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collections that define different aspects of urban culture. 
            Find your style statement.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Card 
              key={collection.id} 
              className="group bg-card border-border shadow-card hover:shadow-neon/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-overlay group-hover:opacity-70 transition-opacity duration-300" />
                
                {/* Collection Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-bold font-heading mb-2 text-foreground">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    {collection.description}
                  </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {collection.itemCount} items
                      </span>
                      <a href="/shop">
                        <Button 
                          variant="outline" 
                          className="border-foreground text-foreground hover:bg-foreground hover:text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          EXPLORE
                        </Button>
                      </a>
                    </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Shirt Collection Scroll Animation */}
        <div className="my-20">
          <ShirtCollectionDemo />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold font-heading mb-4">
            CAN'T DECIDE?
          </h2>
          <p className="text-muted-foreground mb-8">
            Browse all our products and find exactly what speaks to you
          </p>
          <div className="space-y-3">
            <a href="/shop">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6"
              >
                VIEW ALL PRODUCTS
              </Button>
            </a>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Collections;