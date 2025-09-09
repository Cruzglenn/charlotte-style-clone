import heroImage from "@/assets/hero-streetwear.jpg";
import { Button } from "@/components/ui/button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

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
          <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-wider animate-fade-up">
            <span className="text-white">DEEPLY</span>
            <br />
            <span className="text-black animate-pulse-slow">
              ROOTED
            </span>
          </h1>

                    {/* Gooey Text Morphing */}
                    <div className="animate-fade-up animation-delay-450">
            <GooeyText
              texts={["WE FAIL.", "WE LEARN.", "WE CONQUER."]}
              morphTime={1.2}
              cooldownTime={1.5}
              className="font-bold"
              textClassName="text-2xl md:text-4xl text-black font-heading"
            />
          </div>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-300">
            Authentic streetwear that connects you to your heritage. 
            Where tradition meets modern style.
          </p>



          <div className="pt-8 animate-fade-up animation-delay-600">
            <a href="/shop">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-12 py-6 text-lg font-semibold tracking-wide shadow-neon transition-all duration-300 hover:scale-105 hover:shadow-neon/50 relative overflow-hidden group"
              >
                <span className="relative z-10">SHOP NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </a>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 text-muted-foreground animate-fade-up animation-delay-600">
        <div className="flex items-center space-x-2 hover:text-primary transition-all duration-300 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/30 to-primary animate-pulse-slow"></div>
          <span className="text-xs rotate-90 whitespace-nowrap hover:scale-110 transition-transform duration-300">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;