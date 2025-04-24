
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast("Authentication Required", {
      description: "Please sign in to access this page"
    });
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
