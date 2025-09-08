import heroImage from "@/assets/hero-streetwear.jpg";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Urban streetwear collection featuring diverse models in modern t-shirts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-wider">
            URBAN
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              COLLECTION
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Elevate your street style with our premium t-shirt collection. 
            Designed for the urban explorer.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-lg font-semibold tracking-wide shadow-neon transition-bounce hover:scale-105"
            >
              SHOP NOW
            </Button>
          </div>

          {/* Collection Badge */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-card/20 backdrop-blur-sm border border-border rounded-lg px-6 py-3">
              <p className="text-sm text-muted-foreground">
                LIMITED EDITION • 2024 COLLECTION
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-px h-16 bg-muted-foreground/30"></div>
          <span className="text-xs rotate-90 whitespace-nowrap">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;