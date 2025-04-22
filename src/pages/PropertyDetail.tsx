
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockProperties } from "@/data/mockData";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  Share2,
  Printer,
  Flag,
  Bed,
  Bath,
  Square,
  Calendar,
  Building,
  ArrowRight,
  Check,
  X,
  User,
  Home,
  Image
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const property = mockProperties.find(p => p.id === id) || mockProperties[0]; // Fallback to first property
  const [showContactForm, setShowContactForm] = useState(false);
  
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getPropertyTypeLabel = () => {
    if (property.type === "residential") {
      switch(property.subType) {
        case "flat": return "Apartment";
        case "house": return "Independent House/Villa";
        case "floor": return "Builder Floor";
        case "studio": return "Studio Apartment";
        case "serviced": return "Serviced Apartment";
        case "farmhouse": return "Farmhouse";
        default: return "Residential Property";
      }
    } else {
      switch(property.subType) {
        case "office": return "Office Space";
        case "retail": return "Retail Space";
        case "warehouse": return "Warehouse";
        case "industrial-land": return "Industrial Land";
        case "commercial-land": return "Commercial Land";
        default: return "Commercial Property";
      }
    }
  };

  // Find similar properties (based on type and location)
  const similarProperties = mockProperties.filter(p => 
    p.id !== property.id && 
    p.type === property.type && 
    p.location.city === property.location.city
  ).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Property Images */}
      <section className="relative bg-gray-200 h-96">
        <div className="flex h-full">
          <div className="w-2/3 h-full overflow-hidden">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/3 h-full grid grid-rows-2 gap-1 pl-1">
            {property.images.slice(1, 3).map((image, index) => (
              <div key={index} className="overflow-hidden">
                <img 
                  src={image} 
                  alt={`${property.title} - view ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="absolute bottom-4 right-4 bg-white text-estate-700 hover:bg-estate-50">
                <Image className="h-4 w-4 mr-2" /> View All Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Property Gallery</DialogTitle>
                <DialogDescription>
                  {property.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                {property.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${property.title} - view ${index + 1}`}
                    className="rounded-md object-cover w-full h-40"
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="container mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {property.purpose === "sell" ? "For Sale" : property.purpose === "rent" ? "For Rent" : "PG"}
                    </Badge>
                    <Badge variant="outline">{getPropertyTypeLabel()}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold mb-1">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location.society ? `${property.location.society}, ` : ''}
                    {property.location.locality}, {property.location.city}, {property.location.pincode}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-estate-600">
                    {formatPrice(property.price)}
                    {property.purpose === "rent" && <span className="text-sm font-normal">/month</span>}
                  </div>
                  {property.securityDeposit && (
                    <div className="text-sm text-muted-foreground">
                      Security: {formatPrice(property.securityDeposit)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-y-4 gap-x-8 mt-6 mb-2">
                {property.details.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-estate-500" />
                    <div>
                      <div className="font-medium">{property.details.bedrooms}</div>
                      <div className="text-xs text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                )}
                
                {property.details.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-estate-500" />
                    <div>
                      <div className="font-medium">{property.details.bathrooms}</div>
                      <div className="text-xs text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                )}
                
                {(property.details.carpetArea || property.details.builtUpArea) && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-estate-500" />
                    <div>
                      <div className="font-medium">
                        {property.details.carpetArea || property.details.builtUpArea} sq.ft
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {property.details.carpetArea ? "Carpet Area" : "Built-up Area"}
                      </div>
                    </div>
                  </div>
                )}
                
                {property.details.furnishing && (
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-estate-500" />
                    <div>
                      <div className="font-medium capitalize">
                        {property.details.furnishing}
                      </div>
                      <div className="text-xs text-muted-foreground">Furnishing</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-estate-500" />
                  <div>
                    <div className="font-medium">
                      {new Date(property.availability).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">Available From</div>
                  </div>
                </div>
                
                {property.details.age && (
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-estate-500" />
                    <div>
                      <div className="font-medium">
                        {property.details.age === "0-1" 
                          ? "Under 1 Year" 
                          : property.details.age === "1-5" 
                          ? "1-5 Years" 
                          : property.details.age === "5-10" 
                          ? "5-10 Years" 
                          : property.details.age === "10+" 
                          ? "10+ Years"
                          : "New Launch"}
                      </div>
                      <div className="text-xs text-muted-foreground">Property Age</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" /> Save
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                  <Flag className="h-4 w-4" /> Report
                </Button>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="bg-white mt-6 p-6 rounded-lg shadow-sm">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  {property.type === "residential" && (
                    <TabsTrigger value="furnishing">Furnishing</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="overview" className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Property Description</h3>
                  <p className="mb-6 whitespace-pre-line text-muted-foreground">
                    {property.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Property Details</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property Type</span>
                            <span>{getPropertyTypeLabel()}</span>
                          </li>
                          {property.details.bedrooms && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Bedrooms</span>
                              <span>{property.details.bedrooms}</span>
                            </li>
                          )}
                          {property.details.bathrooms && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Bathrooms</span>
                              <span>{property.details.bathrooms}</span>
                            </li>
                          )}
                          {property.details.balconies && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Balconies</span>
                              <span>{property.details.balconies}</span>
                            </li>
                          )}
                          {property.details.furnishing && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Furnishing</span>
                              <span className="capitalize">{property.details.furnishing}</span>
                            </li>
                          )}
                          {property.details.totalFloors && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total Floors</span>
                              <span>{property.details.totalFloors}</span>
                            </li>
                          )}
                          {property.details.floorNumber !== undefined && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Floor Number</span>
                              <span>{property.details.floorNumber}</span>
                            </li>
                          )}
                          {property.details.facing && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Facing</span>
                              <span className="capitalize">{property.details.facing}</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Area Details</h4>
                        <ul className="space-y-2">
                          {property.details.builtUpArea && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Built-up Area</span>
                              <span>{property.details.builtUpArea} sq.ft</span>
                            </li>
                          )}
                          {property.details.carpetArea && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Carpet Area</span>
                              <span>{property.details.carpetArea} sq.ft</span>
                            </li>
                          )}
                          {property.details.plotArea && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Plot Area</span>
                              <span>{property.details.plotArea} sq.ft</span>
                            </li>
                          )}
                        </ul>
                        
                        <h4 className="font-medium mb-3 mt-6">Price Details</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">
                              {property.purpose === "sell" ? "Selling Price" : "Monthly Rent"}
                            </span>
                            <span className="font-medium">{formatPrice(property.price)}</span>
                          </li>
                          {property.securityDeposit && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Security Deposit</span>
                              <span>{formatPrice(property.securityDeposit)}</span>
                            </li>
                          )}
                          {property.purpose !== "sell" && property.termsAndConditions?.agreementDuration && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Agreement Duration</span>
                              <span>{property.termsAndConditions.agreementDuration} months</span>
                            </li>
                          )}
                          {property.purpose !== "sell" && property.termsAndConditions?.noticePeriod && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Notice Period</span>
                              <span>{property.termsAndConditions.noticePeriod} month(s)</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Detailed Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Property Information</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property ID</span>
                            <span>{property.id}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property Type</span>
                            <span>{getPropertyTypeLabel()}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property Purpose</span>
                            <span className="capitalize">
                              {property.purpose === "sell" ? "For Sale" : property.purpose === "rent" ? "For Rent" : "PG/Co-living"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property Age</span>
                            <span>
                              {property.details.age === "0-1" 
                                ? "Under 1 Year" 
                                : property.details.age === "1-5" 
                                ? "1-5 Years" 
                                : property.details.age === "5-10" 
                                ? "5-10 Years" 
                                : property.details.age === "10+" 
                                ? "10+ Years"
                                : "New Launch"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Available From</span>
                            <span>
                              {new Date(property.availability).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </li>
                          {property.details.parking && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Parking</span>
                              <span className="capitalize">
                                {property.details.parking === "none" ? "No Parking" : property.details.parking}
                                {property.details.parkingSpots && property.details.parkingSpots > 0 && 
                                 ` (${property.details.parkingSpots} spot${property.details.parkingSpots > 1 ? 's' : ''})`}
                              </span>
                            </li>
                          )}
                        </ul>

                        <Separator className="my-4" />
                        
                        <h4 className="font-medium mb-3">Address Details</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">City</span>
                            <span>{property.location.city}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Locality</span>
                            <span>{property.location.locality}</span>
                          </li>
                          {property.location.subLocality && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Sub-Locality</span>
                              <span>{property.location.subLocality}</span>
                            </li>
                          )}
                          {property.location.society && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Society/Building</span>
                              <span>{property.location.society}</span>
                            </li>
                          )}
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">PIN Code</span>
                            <span>{property.location.pincode}</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Room Details</h4>
                        <ul className="space-y-2">
                          {property.details.bedrooms && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Bedrooms</span>
                              <span>{property.details.bedrooms}</span>
                            </li>
                          )}
                          {property.details.bathrooms && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Bathrooms</span>
                              <span>{property.details.bathrooms}</span>
                            </li>
                          )}
                          {property.details.balconies && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Balconies</span>
                              <span>{property.details.balconies}</span>
                            </li>
                          )}
                          {property.details.totalFloors && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total Floors</span>
                              <span>{property.details.totalFloors}</span>
                            </li>
                          )}
                          {property.details.floorNumber !== undefined && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Floor Number</span>
                              <span>{property.details.floorNumber}</span>
                            </li>
                          )}
                        </ul>

                        <Separator className="my-4" />
                        
                        <h4 className="font-medium mb-3">Listing Information</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Listed By</span>
                            <span className="capitalize">{property.postedBy.type}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Listed On</span>
                            <span>
                              {new Date(property.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Property Score</span>
                            <span className="flex items-center">
                              {property.propertyScore}%
                              <Badge className="ml-2" variant={property.propertyScore >= 80 ? "default" : "outline"}>
                                {property.propertyScore >= 90 ? "Excellent" : 
                                 property.propertyScore >= 80 ? "Good" : 
                                 property.propertyScore >= 70 ? "Average" : "Basic"}
                              </Badge>
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Views</span>
                            <span>{property.views}</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="mt-2">
                  <h3 className="text-lg font-semibold mb-4">Amenities & Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="capitalize">{amenity.replace(/-/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {property.type === "residential" && (
                  <TabsContent value="furnishing" className="mt-2">
                    <h3 className="text-lg font-semibold mb-4">Furnishing Details</h3>
                    
                    {property.details.furnishing === "unfurnished" ? (
                      <p className="text-muted-foreground">This property is unfurnished.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.details.furnishingDetails && Object.entries(property.details.furnishingDetails).map(([item, value], index) => {
                          // If value is boolean
                          if (typeof value === "boolean") {
                            return value ? (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="capitalize">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                              </div>
                            ) : null;
                          }
                          
                          // If value is number
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-5 w-5 text-green-500" />
                              <span>{value} {item.replace(/([A-Z])/g, ' $1').trim()}{value > 1 ? 's' : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </div>
            
            {/* Similar Properties */}
            <div className="bg-white mt-6 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Similar Properties</h3>
              
              {similarProperties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarProperties.map((prop) => (
                    <Link to={`/property/${prop.id}`} key={prop.id} className="block">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                        <div className="h-36 overflow-hidden">
                          <img 
                            src={prop.images[0]} 
                            alt={prop.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-semibold line-clamp-1">{prop.title}</div>
                            <div className="text-sm font-bold text-estate-600">
                              {formatPrice(prop.price)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {prop.location.locality}, {prop.location.city}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {prop.details.bedrooms && (
                              <span className="flex items-center gap-1">
                                <Bed className="h-3 w-3" /> {prop.details.bedrooms}
                              </span>
                            )}
                            {prop.details.bathrooms && (
                              <span className="flex items-center gap-1">
                                <Bath className="h-3 w-3" /> {prop.details.bathrooms}
                              </span>
                            )}
                            {(prop.details.carpetArea || prop.details.builtUpArea) && (
                              <span className="flex items-center gap-1">
                                <Square className="h-3 w-3" /> {prop.details.carpetArea || prop.details.builtUpArea} sq.ft
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No similar properties found.</p>
              )}
              
              <div className="mt-4 text-center">
                <Button variant="outline" className="group">
                  View More Properties <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={property.postedBy.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{property.postedBy.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize mb-1">{property.postedBy.type}</p>
                  <div className="flex items-center text-xs text-estate-500">
                    <User className="h-3 w-3 mr-1" /> View Profile
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" /> 
                  {property.postedBy.contactInfo.phone.substring(0, 6)}XXXX
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" /> 
                  {property.postedBy.contactInfo.email.substring(0, 2)}...{property.postedBy.contactInfo.email.split('@')[1]}
                </Button>
              </div>
              
              {showContactForm ? (
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Contact {property.postedBy.name}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowContactForm(false)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Your Email</Label>
                      <Input id="email" type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Your Phone</Label>
                      <Input id="phone" type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        className="mt-1" 
                        defaultValue={`I'm interested in this property (${property.id}).`}
                      />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </div>
              ) : (
                <Button className="w-full" onClick={() => setShowContactForm(true)}>
                  Contact {property.postedBy.type}
                </Button>
              )}
            </div>
            
            {/* Map Location (placeholder) */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="bg-gray-200 h-48 rounded-md flex items-center justify-center mb-3">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {property.location.address}
              </p>
              <Button variant="outline" className="w-full">View on Map</Button>
            </div>
            
            {/* Property Score */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Property Score</h3>
                <Badge 
                  variant={property.propertyScore >= 80 ? "default" : "outline"}
                  className="ml-2"
                >
                  {property.propertyScore}%
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Information Completeness</span>
                    <span>{Math.min(property.propertyScore + 10, 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-estate-400" 
                      style={{ width: `${Math.min(property.propertyScore + 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Image Quality</span>
                    <span>{Math.min(property.propertyScore - 5, 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-estate-400" 
                      style={{ width: `${Math.min(property.propertyScore - 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Responsiveness</span>
                    <span>{Math.min(property.propertyScore + 5, 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-estate-400" 
                      style={{ width: `${Math.min(property.propertyScore + 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                This property has a good score, indicating reliable information and quality listing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
