import { X } from "lucide-react";
import { useState } from "react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-midnight border-b border-border">
      <div className="overflow-hidden">
        <div className="flex animate-pulse">
          <div className="flex whitespace-nowrap animate-marquee">
            <span className="mx-8 text-sm text-muted-foreground">
              Support hours 9am-6pm, Mon-Sat
            </span>
            <span className="mx-8 text-sm text-muted-foreground">
              Free shipping on orders over $100
            </span>
            <span className="mx-8 text-sm text-muted-foreground">
              New collection dropping soon
            </span>
            <span className="mx-8 text-sm text-muted-foreground">
              Follow us on Instagram @yourshirtbrand
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBanner;