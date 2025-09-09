import { Button } from "@/components/ui/button";

const BrandStory = () => {
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold font-heading">
                <span className="text-white">DEEPLY</span>
                <br />
                <span className="text-black">ROOTED</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-neon"></div>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p className="animate-fade-up animation-delay-300">
                Born from the streets, shaped by heritage. Deeply Rooted isn't just a brand—
                it's a movement that celebrates the authentic connection between past and present.
              </p>
              
              <p className="animate-fade-up animation-delay-450">
                Every thread tells a story. Every design honors tradition while embracing 
                the future. We create clothing for those who understand that true style 
                comes from knowing where you come from.
              </p>
              
              <p className="animate-fade-up animation-delay-600">
                From the concrete jungles to cultural celebrations, our pieces are crafted 
                for the modern soul who carries their ancestors' strength and their own dreams.
              </p>
            </div>

            <div className="animate-fade-up animation-delay-600">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-8 py-6 text-lg font-semibold tracking-wide hover:scale-105 transition-all duration-300 shadow-neon hover:shadow-neon/50 relative overflow-hidden group"
              >
                <span className="relative z-10">DISCOVER OUR STORY</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                alt="Deeply Rooted brand heritage and culture"
                className="w-full h-[600px] object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-overlay opacity-40"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-8 right-8 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg px-6 py-4 animate-float">
                <p className="text-primary font-semibold text-sm">EST. 2024</p>
                <p className="text-xs text-muted-foreground">AUTHENTIC HERITAGE</p>
              </div>
              
              <div className="absolute bottom-8 left-8 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
                <p className="font-semibold">DEEPLY ROOTED</p>
                <p className="text-sm text-muted-foreground">Where Culture Meets Style</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 stagger-animation">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-300 animate-fade-up">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold font-heading">AUTHENTIC</h3>
            <p className="text-muted-foreground">
              Every piece reflects genuine cultural heritage and timeless craftsmanship.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-300 animate-fade-up">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold font-heading">HERITAGE</h3>
            <p className="text-muted-foreground">
              Honoring the past while creating the future of streetwear fashion.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-300 animate-fade-up">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold font-heading">COMMUNITY</h3>
            <p className="text-muted-foreground">
              Building connections through shared stories and cultural pride.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
