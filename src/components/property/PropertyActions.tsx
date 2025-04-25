import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Property } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Phone, Share2 as Share2Icon } from "lucide-react";
import { toast } from "../ui/sonner";
import { getSafeImageUrl } from "@/utils/imageUtils";

interface PropertyActionsProps {
  property: Property;
  isSaved?: boolean;
  onSave?: (saved: boolean) => void;
}

export const PropertyActions = ({ property }: PropertyActionsProps) => {
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  const handleCallNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowPhoneDialog(true);
  };
  
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `Check out this property: ${property.title}`;
    // Format the price as currency
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(property.price);
    const shareText = `${property.title} - ${formattedPrice} - Listed on Propify`;
    
    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast("Shared", {
          description: "Property shared successfully"
        });
      } else {
        // Fallback to clipboard copy
        navigator.clipboard.writeText(shareUrl);
        toast("Link Copied", {
          description: "Property link has been copied to clipboard"
        });
      }
    } catch (error) {
      // Handle rejection of share dialog or other errors
      console.error("Error sharing:", error);
      // Try clipboard as fallback if share was rejected
      try {
        navigator.clipboard.writeText(shareUrl);
        toast("Link Copied", {
          description: "Property link has been copied to clipboard"
        });
      } catch (clipboardError) {
        toast("Share Failed", {
          description: "Could not share property. Please try again."
        });
      }
    }
  };
  
  return (
    <>
      <div className="space-y-3">
        <Button className="w-full" onClick={handleCallNow}>
          <Phone className="mr-2 h-4 w-4" /> Call Now
        </Button>
        
        <Button variant="outline" className="w-full" onClick={handleShare}>
          <Share2Icon className="mr-2 h-4 w-4" /> Share
        </Button>
        
        <div className="mt-6 bg-muted p-3 rounded-lg text-sm">
          <p className="text-muted-foreground">Listed on {new Date(property.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>
              Here's the contact information for this property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              {property.postedBy.name && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Listed by</span>
                  <span className="font-medium">{property.postedBy.name}</span>
                </div>
              )}
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Contact</span>
              {property.postedBy.contactInfo?.phone && (
                <div className="flex items-center justify-between mt-1 p-3 border rounded-lg">
                  <span className="font-medium">{property.postedBy.contactInfo.phone}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(property.postedBy.contactInfo?.phone || '');
                      toast("Phone Copied", {
                        description: "Phone number has been copied to clipboard"
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
              
              {property.postedBy.contactInfo?.email && (
                <div className="flex items-center justify-between mt-2 p-3 border rounded-lg">
                  <span className="font-medium break-all">{property.postedBy.contactInfo.email}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(property.postedBy.contactInfo?.email || '');
                      toast("Email Copied", {
                        description: "Email has been copied to clipboard"
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
