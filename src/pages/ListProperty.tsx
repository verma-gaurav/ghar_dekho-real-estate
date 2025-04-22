
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ListingForm from "@/components/property/ListingForm";

export default function ListProperty() {
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      navigate('/');
    }
  }, [isAuthenticated, navigate, setShowAuthModal]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <ListingForm />
      </div>
    </div>
  );
}
