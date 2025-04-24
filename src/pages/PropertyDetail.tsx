
import { useEffect, useState } from "react";
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
import { toggleSavedProperty, getSavedProperties } from "@/services/userService";
import { User } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (!id) return;

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const fetchedProperty = await getPropertyById(id);
        setProperty(fetchedProperty);
        
        if (user) {
          const savedProperties = await getSavedProperties(user.id);
          setIsSaved(savedProperties.some(p => p.id === id));
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast("Error", {
          description: "Could not load property details."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id, user]);

  const handleSaveProperty = async () => {
    if (!property || !user) return;
    
    try {
      const saved = await toggleSavedProperty(user.id, property.id);
      setIsSaved(saved);
      
      if (saved) {
        toast("Property Saved", {
          description: "This property has been added to your saved properties."
        });
      } else {
        toast("Property Removed", {
          description: "This property has been removed from your saved properties."
        });
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast("Error", {
        description: "Could not save this property. Please try again."
      });
    }
  };

  const handleContactOwner = () => {
    toast("Contact Request Sent", {
      description: "The property owner will get back to you soon."
    });
  };

  if (loading) {
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6 md:py-12">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <span className="mr-2">←</span> Back to Listings
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <PropertyHeader property={property} />
        </div>

        <div className="mb-8">
          <PropertyImages images={property.images} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{property.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <PropertyDetails property={property} />
              </CardContent>
            </Card>
          </div>

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
                
                <PropertyActions 
                  property={property}
                  isSaved={isSaved}
                  onSave={handleSaveProperty}
                  onContact={handleContactOwner}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
