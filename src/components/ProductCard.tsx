import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartContext } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { Product } from '@/types/firebase';
import { ShoppingCart, Heart } from 'lucide-react';
import { AddToCartAnimation } from '@/components/AddToCartAnimation';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isLoading } = useCartContext();
  const { user } = useAuthContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes.length > 0) {
      return;
    }

    try {
      await addToCart(product.id, selectedSize, 1, selectedColor);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getAvailableStock = () => {
    if (!selectedSize) return 0;
    return product.stock[selectedSize] || 0;
  };

  const isOutOfStock = selectedSize && getAvailableStock() === 0;

  return (
    <Card className="group overflow-hidden bg-card border-border shadow-card transition-all duration-300">
      <div className="relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 text-white font-heading">{product.name}</h3>
          <p className="text-white/70 text-sm line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">₱{product.price}</span>
          <Badge variant="outline" className="text-primary border-primary">{product.category}</Badge>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Size</label>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => {
                const stock = product.stock[size] || 0;
                const isSelected = selectedSize === size;
                const isOutOfStock = stock === 0;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isOutOfStock
                        ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'border-gray-600 text-white hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Color</label>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-gray-600 text-white hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Info */}
        {selectedSize && (
          <div className="text-sm text-white/70">
            {isOutOfStock ? (
              <span className="text-red-400">Out of stock</span>
            ) : (
              <span>{getAvailableStock()} in stock</span>
            )}
          </div>
        )}

        <AddToCartAnimation
          productImage={product.images?.[0] || '/placeholder.svg'}
          onAddToCart={handleAddToCart}
        >
          <Button 
            disabled={isLoading || isOutOfStock || (!selectedSize && product.sizes.length > 0)}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground font-semibold transition-all duration-300"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </AddToCartAnimation>
      </CardContent>
    </Card>
  );
};
