import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getSafeImageUrl } from "@/utils/imageUtils";

interface PropertyImagesProps {
  images: string[];
}

export const PropertyImages = ({ images }: PropertyImagesProps) => {
  // Use default image if no images are provided
  const getDefaultImage = () => 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop';
  
  // Ensure we have at least one image to display
  const displayImages = images && images.length > 0 ? images : [getDefaultImage()];
  
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {displayImages.map((image, index) => (
          <CarouselItem key={index}>
            <AspectRatio ratio={16 / 9}>
              <img
                src={getSafeImageUrl(image)}
                alt={`Property ${index + 1}`}
                className="rounded-lg object-cover w-full h-full"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = getDefaultImage();
                }}
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
