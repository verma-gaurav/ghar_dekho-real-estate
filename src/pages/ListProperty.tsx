
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ListingForm from "@/components/property/ListingForm";
import { PropertyPurpose } from "@/types";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function ListProperty() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { purpose } = useParams<{ purpose?: PropertyPurpose }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (isAuthenticated === false) {
      // Redirect to login page or home
      toast("Login Required", {
        description: "Please log in to list a property",
      });
      navigate('/');
      return;
    }
    
    setIsLoading(false);

    // Validate purpose parameter
    if (purpose && !["sell", "rent", "pg"].includes(purpose)) {
      navigate('/list-property');
    }
  }, [isAuthenticated, navigate, purpose]);

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-6">Please log in to list a property.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <HomeIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-2">List Your Property</h1>
      <p className="text-muted-foreground mb-6">
        {purpose ? `List your property for ${purpose}` : 'Choose a listing type to get started'}
      </p>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <ListingForm defaultPurpose={purpose as PropertyPurpose} />
      </div>
    </div>
  );
}
