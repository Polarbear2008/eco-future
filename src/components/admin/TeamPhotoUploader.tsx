import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon } from "lucide-react";

interface TeamPhotoUploaderProps {
  memberId: number;
  currentImage: string;
  onPhotoUpdate: (id: number, imageUrl: string) => void;
}

const TeamPhotoUploader = ({ memberId, currentImage, onPhotoUpdate }: TeamPhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set uploading state
    setIsUploading(true);

    try {
      // Instead of uploading to Firebase, we'll use a local path
      // In a real app, you would send this file to your server
      // For now, we'll simulate a successful "upload" by using the public path
      
      // Create a unique filename
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // In a real implementation, we would copy the file to public/images/team/
      // Since we can't do that directly in the browser, we'll just use the path
      const imageUrl = `/images/team/${fileName}`;
      
      // Simulate a delay for the "upload"
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the team member's photo
      onPhotoUpdate(memberId, imageUrl);
      
      // Show success message
      toast({
        title: "Success!",
        description: (
          <div>
            <p>Image selected successfully.</p>
            <p className="text-xs mt-1 font-mono bg-gray-100 p-1 rounded">
              Filename: {fileName}
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Team Member Photo</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Image preview */}
        <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          {displayImage && !displayImage.includes('logo.png') ? (
            <img 
              src={previewUrl || currentImage} 
              alt="Team member" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center justify-center h-full">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">No image selected</span>
            </div>
          )}
        </div>
        
        {/* Upload button */}
        <div className="w-full">
          <label className="w-full">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center cursor-pointer"
              disabled={isUploading}
              asChild
            >
              <div>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Select New Photo'}
              </div>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TeamPhotoUploader;
