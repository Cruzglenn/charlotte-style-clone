import AnnouncementBanner from "@/components/AnnouncementBanner";
import SmoothNavigation from "@/components/SmoothNavigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Index = () => {
  useAuthRedirect(); // Auto-redirect admin users to admin panel

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnnouncementBanner />
      <SmoothNavigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BrandStory />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
