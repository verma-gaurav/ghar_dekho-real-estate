import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, Eye, MoreVertical, Pencil, Trash, Home, AlertCircle } from "lucide-react";
import { Property } from "@/types";
import { 
  getUserProperties, 
  updatePropertyStatus, 
  deleteProperty, 
  getPropertyById 
} from "@/services/propertyService";

export default function MyProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchUserProperties();
  }, [user]);

  const fetchUserProperties = async () => {
    if (!user) return;
    try {
      setLoading(true);
      console.log(`Fetching properties for current user: ${user.id}`);
      const userProperties = await getUserProperties(user.id);
      console.log(`Found ${userProperties.length} properties for current user`);
      setProperties(userProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Could not load your properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const handleDeleteClick = (property: Property) => {
    setSelectedProperty(property);
    setDeleteDialogOpen(true);
  };

  const handleStatusClick = (property: Property) => {
    setSelectedProperty(property);
    setNewStatus(property.purpose);
    setStatusDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      await deleteProperty(selectedProperty.id);
      setProperties(properties.filter(p => p.id !== selectedProperty.id));
      toast.success("Property deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedProperty || !newStatus) return;
    
    try {
      await updatePropertyStatus(selectedProperty.id, newStatus);
      
      // Update local state
      setProperties(properties.map(p => 
        p.id === selectedProperty.id ? { ...p, purpose: newStatus as Property["purpose"] } : p
      ));
      
      toast.success(`Property status updated to ${formatPurposeLabel(newStatus)}`);
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating property status:", error);
      toast.error("Failed to update property status");
    }
  };

  const formatPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "sell": return "For Sale";
      case "sold": return "Sold";
      case "rent": return "For Rent";
      case "rented": return "Rented";
      case "pg": return "PG/Co-living";
      default: return purpose;
    }
  };

  const getStatusColor = (purpose: string) => {
    switch (purpose) {
      case "sell": return "bg-blue-100 text-blue-800";
      case "sold": return "bg-green-100 text-green-800";
      case "rent": return "bg-purple-100 text-purple-800";
      case "rented": return "bg-orange-100 text-orange-800";
      case "pg": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSafeImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
    
    if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return 'https://placehold.co/600x400?text=Invalid+Image';
  };

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-6">My Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Button asChild>
          <Link to="/list-property">+ Add New Property</Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-lg border-2 border-dashed border-gray-200">
          <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No properties listed yet</h3>
          <p className="text-muted-foreground mb-6">Start listing your properties on our platform</p>
          <Button asChild>
            <Link to="/list-property">List Your First Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="h-48 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${getSafeImageUrl(property.images[0])})` }}
                onClick={() => handleViewProperty(property.id)}
              >
                <div className="flex justify-between p-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.purpose)}`}>
                    {formatPurposeLabel(property.purpose)}
                  </div>
                  {property.verification_status !== undefined && (
                    <div className="bg-white/90 rounded-full p-1">
                      {property.verification_status ? (
                        <CheckCircle className="h-4 w-4 text-green-400" aria-label="Verified" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" aria-label="Property not verified, contact the team to verify the property" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1" onClick={() => handleViewProperty(property.id)}>
                  {property.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {property.location.locality}, {property.location.city}
                </p>
                <p className="font-bold text-estate-600 mb-3">
                  ₹{property.price.toLocaleString()}
                  {property.purpose === "rent" && <span className="text-sm font-normal">/month</span>}
                </p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewProperty(property.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditProperty(property.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusClick(property)}>
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteClick(property)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Property Status</DialogTitle>
            <DialogDescription>
              Change the status of "{selectedProperty?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sell">For Sale</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="pg">PG/Co-living</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 