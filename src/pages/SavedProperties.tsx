
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Property } from "@/types";
import { getSavedProperties } from "@/services/supabaseService";
import { PropertyCard } from "@/components/ui/property-card";
import { toast } from "@/hooks/use-toast";

export default function SavedProperties() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      navigate('/');
      return;
    }

    const fetchSavedProperties = async () => {
      try {
        setIsLoading(true);
        if (user?.id) {
          const savedProperties = await getSavedProperties(user.id);
          setProperties(savedProperties);
        }
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        toast({
          title: "Error",
          description: "Failed to load your saved properties.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProperties();
  }, [isAuthenticated, navigate, setShowAuthModal, user?.id]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Properties</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No saved properties yet</h2>
          <p className="text-muted-foreground mb-6">
            Browse properties and save the ones you like!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Explore Properties
          </button>
        </div>
      )}
    </div>
  );
}
