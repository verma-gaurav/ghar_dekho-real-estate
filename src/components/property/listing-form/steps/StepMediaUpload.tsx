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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, X, Upload, Plus } from "lucide-react";
import { ListingFormValues } from "../types";
import { getSafeImageUrl, isValidFileSize } from "@/utils/imageUtils";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export const StepMediaUpload = () => {
  const { control, setValue, watch, formState: { errors } } = useFormContext<ListingFormValues>();
  const images = watch("images") || [];
  const coverImageIndex = watch("coverImageIndex") || 0;
  const [imageUrl, setImageUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const addImageUrl = () => {
    if (!imageUrl || imageUrl.trim() === "") return;
    
    // Only add if it's a valid URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      setValue("images", [...images, imageUrl], { shouldValidate: true });
      
      // Set first image as cover if no images were previously uploaded
      if (images.length === 0) {
        setValue("coverImageIndex", 0);
      }
      
      // Clear the input
      setImageUrl("");
    }
  };

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      // Filter out files that are too large
      const validFiles = Array.from(files).filter(file => {
        const isValid = isValidFileSize(file, 5); // 5MB limit
        if (!isValid) {
          toast(`File ${file.name} is too large (max 5MB)`, {
            description: "Please compress your image or choose a smaller one.",
          });
        }
        return isValid;
      });
      
      if (validFiles.length === 0) return;
      
      const filePromises = validFiles.map(file => fileToBase64(file));
      const base64Images = await Promise.all(filePromises);
      
      setValue("images", [...images, ...base64Images], { shouldValidate: true });
      
      // Set first image as cover if no images were previously uploaded
      if (images.length === 0 && base64Images.length > 0) {
        setValue("coverImageIndex", 0);
      }
      
      // Reset the input value to allow selecting the same files again
      e.target.value = "";
    } catch (error) {
      console.error("Error processing image files:", error);
      toast("Error processing images", {
        description: "Some images could not be processed. Please try again with different images.",
      });
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    try {
      // Filter files: only images and size limit
      const validFiles = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .filter(file => {
          const isValid = isValidFileSize(file, 5); // 5MB limit
          if (!isValid) {
            toast(`File ${file.name} is too large (max 5MB)`, {
              description: "Please compress your image or choose a smaller one.",
            });
          }
          return isValid;
        });
      
      if (validFiles.length === 0) return;
      
      const filePromises = validFiles.map(file => fileToBase64(file));
      const base64Images = await Promise.all(filePromises);
      
      setValue("images", [...images, ...base64Images], { shouldValidate: true });
      
      // Set first image as cover if no images were previously uploaded
      if (images.length === 0 && base64Images.length > 0) {
        setValue("coverImageIndex", 0);
      }
    } catch (error) {
      console.error("Error processing dropped image files:", error);
      toast("Error processing images", {
        description: "Some images could not be processed. Please try again with different images.",
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages, { shouldValidate: true });
    
    // Update coverImageIndex if necessary
    if (coverImageIndex === index) {
      setValue("coverImageIndex", newImages.length > 0 ? 0 : 0);
    } else if (coverImageIndex > index) {
      setValue("coverImageIndex", coverImageIndex - 1);
    }
  };

  const setCoverImage = (index: number) => {
    setValue("coverImageIndex", index);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Media</h3>
            <p className="text-sm text-muted-foreground">
          Add photos and videos to showcase your property
            </p>
          </div>
          
      {/* Direct URL input */}
      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Add Image URL</FormLabel>
            <FormDescription>
              Enter direct URLs to property images (must start with http:// or https://)
            </FormDescription>
            <div className="flex gap-2">
          <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
          />
          <Button 
                type="button" 
                onClick={addImageUrl}
                disabled={!imageUrl || !imageUrl.startsWith('http')}
          >
                <Plus className="h-4 w-4 mr-2" />
                Add URL
          </Button>
        </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* File upload area */}
      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Images from Device</FormLabel>
            <FormControl>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragOver ? "border-primary bg-primary/10" : "border-input"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="mb-2 text-sm font-semibold">
                    Drag and drop images here, or click to browse
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP (max 5MB each)
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Upload Images
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Display uploaded images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {index === coverImageIndex && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 z-10"
                      >
                        Cover
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {index !== coverImageIndex && (
                    <Button 
                        type="button"
                        size="icon"
                      variant="secondary" 
                        className="h-6 w-6"
                      onClick={() => setCoverImage(index)}
                    >
                        <Star className="h-3 w-3" />
                    </Button>
                    )}
                    <Button 
                      type="button"
                      size="icon"
                      variant="destructive" 
                      className="h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </div>
        )}
        
        <FormField
        control={control}
          name="video"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Property Video (Optional)</FormLabel>
              <FormControl>
                  <Input
                    {...field}
                type="url"
                placeholder="Paste YouTube or Vimeo URL"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
        control={control}
          name="audioDescription"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Audio Description (Optional)</FormLabel>
              <FormControl>
              <Textarea
                  {...field} 
                placeholder="Describe your property in your own words"
                className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
};
