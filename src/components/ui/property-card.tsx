import { Property } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Bed, Bath, Home, Heart, Building, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow cursor-pointer", className)} onClick={handlePropertyClick}>
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-estate-700">
            {property.purpose === "sell" ? "Sale" : property.purpose === "rent" ? "Rent" : "PG"}
          </Badge>
          {property.details.furnishing && (
            <Badge variant="outline" className="bg-white/90 text-estate-700">
              {property.details.furnishing === "furnished"
                ? "Furnished"
                : property.details.furnishing === "semi-furnished"
                ? "Semi-Furnished"
                : "Unfurnished"}
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-white/90 h-8 w-8 p-1 text-estate-700 hover:text-estate-300"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
          <p className="font-bold text-lg text-estate-400">
            {formatPrice(property.price)}
            {property.purpose === "rent" && <span className="text-sm font-normal">/mo</span>}
          </p>
        </div>
        <p className="text-sm text-muted-foreground flex items-center">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.location.society ? `${property.location.society}, ` : ''}
            {property.location.locality}, {property.location.city}
          </span>
        </p>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="flex flex-wrap gap-2 my-2">
          {property.details.bedrooms && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {property.details.bedrooms} {property.details.bedrooms === 1 ? "Bed" : "Beds"}
            </Badge>
          )}
          {property.details.bathrooms && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.details.bathrooms} {property.details.bathrooms === 1 ? "Bath" : "Baths"}
            </Badge>
          )}
          {property.details.carpetArea && (
            <Badge variant="outline" className="flex items-center gap-1">
              {property.details.carpetArea} sq.ft
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            {getPropertyTypeIcon()}
            {property.subType === "flat" 
              ? "Apartment" 
              : property.subType.charAt(0).toUpperCase() + property.subType.slice(1).replace(/-/g, ' ')}
          </Badge>
        </div>

        <p className="text-sm line-clamp-2 text-muted-foreground mt-2">
          {property.description}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
        </div>
        <div className="flex items-center">
          <Eye className="h-3.5 w-3.5 mr-1" />
          {property.views} views
        </div>
        <div>
          <Badge variant={property.propertyScore >= 90 ? "secondary" : "outline"} className="text-xs">
            {property.propertyScore}% Match
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
