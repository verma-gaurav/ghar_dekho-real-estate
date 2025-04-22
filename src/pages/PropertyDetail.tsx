
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon, Share2Icon, Phone, MessageSquare, MapPin, Calendar, User, Bed, Bath, Maximize, Sofa, Key, Building, CheckSquare } from "lucide-react";
import { Property } from "@/types";
import database from "@/services/database";
import { toast } from "@/hooks/use-toast";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      // Fetch property details
      const fetchedProperty = database.getPropertyById(id);
      
      if (fetchedProperty) {
        setProperty(fetchedProperty);
        
        // Increment views
        database.updateProperty(id, { views: fetchedProperty.views + 1 });
        
        // Check if saved (normally would check against logged in user)
        const currentUser = database.getUserById("user1"); // Hardcoded for demo
        if (currentUser) {
          setIsSaved(currentUser.savedProperties.includes(id));
        }
      }
      
      setLoading(false);
    }
  }, [id]);

  const handleSaveProperty = () => {
    if (!property) return;
    
    // Toggle saved status (normally would use logged in user)
    const saved = database.toggleSavedProperty("user1", property.id);
    setIsSaved(saved);
    
    if (saved) {
      toast({
        title: "Property Saved",
        description: "This property has been added to your saved properties.",
      });
    } else {
      toast({
        title: "Property Removed",
        description: "This property has been removed from your saved properties.",
        variant: "destructive",
      });
    }
  };

  const handleContactOwner = () => {
    toast({
      title: "Contact Request Sent",
      description: "The property owner will get back to you soon.",
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="w-full h-96 animate-pulse bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(2)}k`;
    } else {
      return `₹${price}`;
    }
  };

  const propertyArea = property.details.carpetArea || property.details.builtUpArea || property.details.plotArea || 0;
  const propertyPurposeBadge = property.purpose === "sell" ? "For Sale" : property.purpose === "rent" ? "For Rent" : "PG";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6 md:py-12">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <span className="mr-2">←</span> Back to Listings
            </Link>
          </Button>
        </div>

        {/* Property title and key info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location.locality}, {property.location.city}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl md:text-3xl font-bold text-estate-500">
                {formatPrice(property.price)}
                {property.purpose === "rent" && <span className="text-base text-muted-foreground">/month</span>}
              </div>
              {property.purpose === "rent" && property.securityDeposit && (
                <div className="text-sm text-muted-foreground">
                  Security: {formatPrice(property.securityDeposit)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property images */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Property details grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Left column - main details */}
          <div className="md:col-span-2">
            {/* Key details and features card */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Key Details</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={property.purpose === "sell" ? "default" : "secondary"}>
                      {propertyPurposeBadge}
                    </Badge>
                    <Badge variant="outline">{property.views} Views</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.details.bedrooms && (
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Bed className="h-5 w-5 text-estate-500 mb-1" />
                      <span className="text-sm font-medium">{property.details.bedrooms} Beds</span>
                    </div>
                  )}
                  
                  {property.details.bathrooms && (
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Bath className="h-5 w-5 text-estate-500 mb-1" />
                      <span className="text-sm font-medium">{property.details.bathrooms} Baths</span>
                    </div>
                  )}
                  
                  {propertyArea > 0 && (
                    <div className="flex flex-col items-center p-3 border rounded-lg">
                      <Maximize className="h-5 w-5 text-estate-500 mb-1" />
                      <span className="text-sm font-medium">{propertyArea} sq.ft</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center p-3 border rounded-lg">
                    <Sofa className="h-5 w-5 text-estate-500 mb-1" />
                    <span className="text-sm font-medium">{property.details.furnishing}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">About this property</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed information tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="details">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="terms">Terms</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Property Type</p>
                        <p className="font-medium">{property.type} - {property.subType}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Posted On</p>
                        <p className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      {property.details.floorNumber !== undefined && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Floor</p>
                          <p className="font-medium">{property.details.floorNumber} of {property.details.totalFloors}</p>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Age of Property</p>
                        <p className="font-medium">{property.details.age} years</p>
                      </div>
                      
                      {property.details.facing && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Facing</p>
                          <p className="font-medium">{property.details.facing}</p>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Parking</p>
                        <p className="font-medium">{property.details.parking}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-green-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="terms">
                    <div className="space-y-4">
                      {property.purpose === "rent" && property.termsAndConditions && (
                        <>
                          {property.termsAndConditions.agreementDuration && (
                            <div className="flex items-start gap-3">
                              <Calendar className="h-5 w-5 text-estate-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">Agreement Duration</h4>
                                <p className="text-sm text-muted-foreground">{property.termsAndConditions.agreementDuration} Months</p>
                              </div>
                            </div>
                          )}
                          
                          {property.termsAndConditions.noticePeriod && (
                            <div className="flex items-start gap-3">
                              <Calendar className="h-5 w-5 text-estate-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">Notice Period</h4>
                                <p className="text-sm text-muted-foreground">{property.termsAndConditions.noticePeriod} Months</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-estate-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Tenant Preference</h4>
                              <p className="text-sm text-muted-foreground">
                                {property.details.hasOwnProperty('tenantPreference') 
                                  ? (property.details as any).tenantPreference
                                  : 'Any'}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-estate-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Availability</h4>
                          <p className="text-sm text-muted-foreground">{property.availability}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right column - contact card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact {property.postedBy.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-estate-500" />
                  </div>
                  <div>
                    <p className="font-medium">{property.postedBy.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{property.postedBy.type}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleContactOwner}>
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={handleContactOwner}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={handleSaveProperty}
                  >
                    <HeartIcon className={`mr-2 h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} /> 
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button variant="outline" className="w-full" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Property link has been copied to clipboard",
                    });
                  }}>
                    <Share2Icon className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
                
                <div className="mt-6 bg-muted p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Property ID: {property.id}</p>
                  <p className="text-muted-foreground">Listed on {new Date(property.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
