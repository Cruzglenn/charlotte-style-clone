import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";

interface FilterState {
  search: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStock: boolean;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ProductFilter = ({ onFilterChange, isOpen, onToggle }: ProductFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [1000, 5000],
    inStock: false,
  });

  const categories = ["ROOTS", "LEGACY", "TRADITION", "HERITAGE", "CULTURE"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Navy", "Charcoal", "Olive", "Burgundy"];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: 'categories' | 'sizes' | 'colors', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [1000, 5000],
      inStock: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.sizes.length + 
    filters.colors.length + 
    (filters.inStock ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isOpen ? "w-80" : "w-0 overflow-hidden"
    }`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={20} />
            <h3 className="font-bold font-heading">FILTERS</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              max={10000}
              min={500}
              step={250}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="text-white">₱{filters.priceRange[0].toLocaleString()}</span>
            <span className="text-white">₱{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter("categories", category)}
                />
                <Label
                  htmlFor={category}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label>Sizes</Label>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter("sizes", size)}
                className="h-8 text-xs"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <Label>Colors</Label>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleArrayFilter("colors", color)}
                className={`h-8 rounded-lg border-2 transition-all duration-300 flex items-center justify-center text-xs font-medium ${
                  filters.colors.includes(color)
                    ? "border-primary scale-110"
                    : "border-muted-foreground/30 hover:border-primary"
                } ${
                  color === "Black" ? "bg-black text-white" :
                  color === "White" ? "bg-white text-black border-gray-300" :
                  color === "Navy" ? "bg-gray-800 text-white" :
                  color === "Charcoal" ? "bg-gray-600 text-white" :
                  color === "Olive" ? "bg-green-700 text-white" :
                  "bg-red-900 text-white"
                }`}
              >
                {filters.colors.includes(color) && "✓"}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilter("inStock", checked)}
          />
          <Label
            htmlFor="inStock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            In Stock Only
          </Label>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
