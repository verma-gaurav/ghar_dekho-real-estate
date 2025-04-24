
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image, Video, Upload, Trash2 } from "lucide-react";

export const StepMediaUpload = () => {
  const form = useFormContext();
  const [selectedImages, setSelectedImages] = useState<string[]>(form.getValues('images') || []);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(form.getValues('coverImageIndex') || 0);

  // Function to handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = [];
      
      Array.from(e.target.files).forEach(file => {
        // In a real implementation, you'd upload these to a storage service
        // For now, we'll just create object URLs for preview
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      });
      
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
      form.setValue('images', updatedImages, { shouldValidate: true });
      
      // If this is the first image, make it the cover image
      if (selectedImages.length === 0 && newImages.length > 0) {
        setCoverImageIndex(0);
        form.setValue('coverImageIndex', 0, { shouldValidate: true });
      }
    }
  };

  // Function to remove an image
  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    form.setValue('images', updatedImages, { shouldValidate: true });
    
    // Adjust cover image index if needed
    if (coverImageIndex === index) {
      const newCoverIndex = updatedImages.length > 0 ? 0 : -1;
      setCoverImageIndex(newCoverIndex);
      form.setValue('coverImageIndex', newCoverIndex, { shouldValidate: true });
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
      form.setValue('coverImageIndex', coverImageIndex - 1, { shouldValidate: true });
    }
  };

  // Function to set cover image
  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
    form.setValue('coverImageIndex', index, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Step 4: Media Upload</div>
      
      {/* Photo Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Photos</h3>
        <FormDescription>
          Upload photos of your property. The first image will be used as the cover photo.
        </FormDescription>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <Image className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload property photos (JPEG, PNG, WebP)
            </p>
          </div>
          
          <Input
            type="file"
            accept="image/*"
            multiple
            id="property-photos"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('property-photos')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Photos
          </Button>
        </div>
        
        {/* Image Preview Section */}
        {selectedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Selected Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-lg overflow-hidden border-2 ${coverImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setCoverImage(index)}
                      disabled={coverImageIndex === index}
                    >
                      Set as Cover
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {coverImageIndex === index && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Video Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Video</h3>
        
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormDescription>
                Add a YouTube, Vimeo, or other video URL to showcase your property.
              </FormDescription>
              <FormControl>
                <div className="relative">
                  <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="e.g., https://youtube.com/watch?v=XXXX" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Audio Description Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Audio Description</h3>
        
        <FormField
          control={form.control}
          name="audioDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audio Description URL</FormLabel>
              <FormDescription>
                Add an audio narration to describe your property (optional).
              </FormDescription>
              <FormControl>
                <Input 
                  placeholder="Audio file URL" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
