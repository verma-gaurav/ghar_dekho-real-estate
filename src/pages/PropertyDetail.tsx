import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { toast } from "@/components/ui/sonner";
import { PropertyDetailSkeleton } from "@/components/property/PropertyDetailSkeleton";
import { PropertyImages } from "@/components/property/PropertyImages";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { getPropertyById } from "@/services/propertyService";
import { User } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [fetchedPropertyId, setFetchedPropertyId] = useState<string | null>(null);
  
  // Memoize the fetchPropertyDetails function to avoid recreating it on every render
  const fetchPropertyDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Only fetch property data if it's not already fetched or if the ID has changed
      if (id !== fetchedPropertyId) {
        console.log(`Fetching property details for ID: ${id}`);
        const fetchedProperty = await getPropertyById(id);
        setProperty(fetchedProperty);
        setFetchedPropertyId(id);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast("Error", {
        description: "Could not load property details."
      });
    } finally {
      setLoading(false);
    }
  }, [id, fetchedPropertyId]);
  
  useEffect(() => {
    fetchPropertyDetails();
  }, [fetchPropertyDetails]);

  if (loading && !property) {
    return <PropertyDetailSkeleton />;
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

  return (
    <div className="container pb-12">
      <PropertyHeader property={property} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <PropertyImages images={property.images} />
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyDetails property={property} />
            </CardContent>
          </Card>
          
          {property.description && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line">{property.description}</div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <PropertyActions property={property} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
