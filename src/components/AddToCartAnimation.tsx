import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartAnimationProps {
  children: React.ReactNode;
  productImage: string;
  onAddToCart: () => void;
}

export const AddToCartAnimation = ({ children, productImage, onAddToCart }: AddToCartAnimationProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const flyingImageRef = useRef<HTMLImageElement>(null);

  const handleAddToCart = useCallback(() => {
    // Get cart icon position (assuming it's in the top right)
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
    if (!cartIcon || !buttonRef.current) {
      onAddToCart();
      return;
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create flying image element
    const flyingImage = document.createElement('img');
    flyingImage.src = productImage;
    flyingImage.style.cssText = `
      position: fixed;
      top: ${buttonRect.top}px;
      left: ${buttonRect.left}px;
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      z-index: 9999;
      pointer-events: none;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(flyingImage);

    // Animate to cart
    requestAnimationFrame(() => {
      flyingImage.style.transform = `translate(${cartRect.left - buttonRect.left}px, ${cartRect.top - buttonRect.top}px) scale(0.3)`;
      flyingImage.style.opacity = '0';
    });

    // Call onAddToCart immediately for real-time update
    onAddToCart();
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(flyingImage);
      
      // Add cart bounce animation
      if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
          cartIcon.style.transform = 'scale(1)';
        }, 200);
      }
    }, 800);

  }, [productImage, onAddToCart]);

  return (
    <div ref={buttonRef} onClick={handleAddToCart}>
      {children}
    </div>
  );
};
