import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockSearchResults = [
    { id: 1, name: "MIDNIGHT TEE", price: "₱699", category: "ESSENTIALS" },
    { id: 2, name: "NEON NIGHTS", price: "₱699", category: "LIMITED" },
    { id: 3, name: "STREET LEGEND", price: "₱699", category: "BESTSELLER" },
  ];

  const filteredResults = mockSearchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">SEARCH PRODUCTS</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {filteredResults.length} Results for "{searchQuery}"
              </h3>
              
              <div className="space-y-3">
                {filteredResults.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors cursor-pointer"
                    onClick={() => {
                      // Navigate to product or close modal
                      onClose();
                    }}
                  >
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="text-white font-semibold">{item.price}</span>
                  </div>
                ))}
              </div>
              
              {filteredResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["T-shirts", "Hoodies", "Limited Edition", "Black Tees", "Streetwear"].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                    className="border-border hover:bg-secondary"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;