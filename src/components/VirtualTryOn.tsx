import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, RotateCcw, Download, Share2 } from "lucide-react";

interface VirtualTryOnProps {
  productName: string;
  productImage: string;
}

const VirtualTryOn = ({ productName, productImage }: VirtualTryOnProps) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState("model1");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const models = [
    { id: "model1", name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop" },
    { id: "model2", name: "Jordan", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=300&fit=crop" },
    { id: "model3", name: "Casey", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=300&fit=crop" },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Camera size={16} className="mr-2" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold font-heading mb-2">Virtual Try-On</h2>
            <p className="text-muted-foreground">See how {productName} looks on you</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Model Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Choose Model or Upload Photo</h3>
              
              {/* Upload Photo */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload your photo</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Choose File
                  </Button>
                </label>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Or choose a model:</p>
                <div className="grid grid-cols-3 gap-2">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedModel === model.id ? "border-primary scale-105" : "border-transparent"
                      }`}
                    >
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                        {model.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Virtual Try-On Display */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative bg-card rounded-lg overflow-hidden aspect-[3/4] border border-border">
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Your photo" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src={models.find(m => m.id === selectedModel)?.image} 
                    alt="Selected model" 
                    className="w-full h-full object-cover" 
                  />
                )}
                
                {/* Product Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-64 opacity-80 bg-gradient-to-b from-transparent via-primary/20 to-transparent rounded-lg border border-primary/30">
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                {/* AR Simulation Badge */}
                <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                  AR Simulation
                </Badge>

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <RotateCcw size={16} />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download size={16} />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Try-On Actions */}
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground"
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? "Stop Try-On" : "Start Try-On"}
                </Button>
                <Button variant="outline" className="flex-1">
                  Save Look
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time fitting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Size recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Color variations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Share with friends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTryOn;
