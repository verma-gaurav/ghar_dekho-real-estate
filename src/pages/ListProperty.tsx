import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>
      {/* Form implementation will be added in the next iteration */}
    </div>
  );
}
