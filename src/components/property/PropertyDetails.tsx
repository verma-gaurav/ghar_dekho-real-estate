
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types";
import { Calendar, User, CheckSquare, Key } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
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
  );
};
