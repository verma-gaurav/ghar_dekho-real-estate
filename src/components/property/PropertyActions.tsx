
import { useState } from "react";
import { HeartIcon, Phone, MessageSquare, Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Property } from "@/types";
import { toggleSavedProperty } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

interface PropertyActionsProps {
  property: Property;
  isSaved: boolean;
  onSave: (newSaveState: boolean) => void;
  onContact: () => void;
}

export const PropertyActions = ({ property, isSaved, onSave, onContact }: PropertyActionsProps) => {
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  
  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      setIsToggling(true);
      const result = await toggleSavedProperty(user!.id, property.id);
      onSave(result);
      toast({
        title: result ? "Property Saved" : "Property Removed",
        description: result 
          ? "This property has been added to your saved list" 
          : "This property has been removed from your saved list",
      });
    } catch (error) {
      console.error("Error toggling property:", error);
      toast({
        title: "Error",
        description: "Could not save/unsave this property",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={onContact}>
        <Phone className="mr-2 h-4 w-4" /> Call Now
      </Button>
      
      <Button variant="outline" className="w-full" onClick={onContact}>
        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
      </Button>
      
      <Button 
        variant="secondary" 
        className="w-full" 
        onClick={handleSave}
        disabled={isToggling}
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
      
      <div className="mt-6 bg-muted p-3 rounded-lg text-sm">
        <p className="font-medium mb-1">Property ID: {property.id}</p>
        <p className="text-muted-foreground">Listed on {new Date(property.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
