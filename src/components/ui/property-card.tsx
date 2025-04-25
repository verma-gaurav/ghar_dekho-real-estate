import { Property } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Bed, Bath, Home, Heart, Building, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getSafeImageUrl } from "@/utils/imageUtils";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const handlePropertyClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/property/${property.id}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getPropertyTypeIcon = () => {
    if (property.type === "commercial") {
      return <Building className="h-4 w-4 mr-1" />;
    }
    return <Home className="h-4 w-4 mr-1" />;
  };

  const getDefaultImageUrl = () => {
    return property.type === "commercial"
      ? "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop";
  };

  // Get a safe image URL, with fallback to default image if not available
  const propertyImage = property.images && property.images.length > 0
    ? getSafeImageUrl(property.images[0])
    : getDefaultImageUrl();

  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full", className)} onClick={handlePropertyClick}>
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-2/5">
          <img
            src={propertyImage}
            alt={property.title}
            className="h-40 md:h-full w-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = getDefaultImageUrl();
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="bg-white/90 text-estate-700 text-xs">
              {property.purpose === "sell" ? "Sale" : property.purpose === "rent" ? "Rent" : "PG"}
            </Badge>
            {property.details.furnishing && (
              <Badge variant="outline" className="bg-white/90 text-estate-700 text-xs">
                {property.details.furnishing === "furnished"
                  ? "Furn"
                  : property.details.furnishing === "semi-furnished"
                  ? "Semi"
                  : "Unfurn"}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full bg-white/90 h-6 w-6 p-1 text-estate-700 hover:text-estate-300"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col justify-between md:w-3/5">
          <div>
            <CardHeader className="p-2 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-base line-clamp-1">{property.title}</h3>
                  {property.verification_status !== undefined && (
                    property.verification_status ? (
                      <span title="Verified">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </span>
                    ) : (
                      <span title="Property not verified, contact the team to verify the property">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      </span>
                    )
                  )}
                </div>
                <p className="font-bold text-base text-estate-400">
                  {formatPrice(property.price)}
                  {property.purpose === "rent" && <span className="text-xs font-normal">/mo</span>}
                </p>
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">
                  {property.location.society ? `${property.location.society}, ` : ''}
                  {property.location.locality}, {property.location.city}
                </span>
              </p>
            </CardHeader>

            <CardContent className="p-2 pt-1">
              <div className="flex flex-wrap gap-1 my-1">
                {property.details.bedrooms && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs py-0 h-5">
                    <Bed className="h-3 w-3" />
                    {property.details.bedrooms}
                  </Badge>
                )}
                {property.details.bathrooms && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs py-0 h-5">
                    <Bath className="h-3 w-3" />
                    {property.details.bathrooms}
                  </Badge>
                )}
                {property.details.carpetArea && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs py-0 h-5">
                    {property.details.carpetArea} sq.ft
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1 text-xs py-0 h-5">
                  {getPropertyTypeIcon()}
                  {property.subType === "flat" 
                    ? "Apt" 
                    : property.subType.charAt(0).toUpperCase() + property.subType.slice(1).replace(/-/g, ' ')}
                </Badge>
              </div>

              <p className="text-xs line-clamp-1 text-muted-foreground mt-1">
                {property.description}
              </p>
            </CardContent>
          </div>

          <CardFooter className="p-2 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t mt-1">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {property.views} 
            </div>
            <div>
              <Badge variant={property.propertyScore >= 90 ? "secondary" : "outline"} className="text-xs py-0 h-5">
                {property.propertyScore}%
              </Badge>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
