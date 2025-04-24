
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { addProperty } from "@/services/propertyService";
import { toast } from "@/hooks/use-toast";
import { ListingFormValues } from "../types";
import { ResidentialType, CommercialType, UserType } from "@/types";

export const useListingSubmit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ListingFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to list a property",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let typedSubType: ResidentialType | CommercialType;
      if (data.type === "residential") {
        typedSubType = data.subType as ResidentialType;
      } else {
        typedSubType = data.subType as CommercialType;
      }

      const propertyData = {
        title: data.title,
        purpose: data.purpose,
        type: data.type,
        subType: typedSubType,
        price: Number(data.price),
        securityDeposit: data.securityDeposit ? Number(data.securityDeposit) : undefined,
        description: data.description,
        location: data.location,
        details: {
          ...data.details,
          bedrooms: data.details.bedrooms ? Number(data.details.bedrooms) : undefined,
          bathrooms: data.details.bathrooms ? Number(data.details.bathrooms) : undefined,
          balconies: data.details.balconies ? Number(data.details.balconies) : undefined,
          plotArea: data.details.plotArea ? Number(data.details.plotArea) : undefined,
          builtUpArea: data.details.builtUpArea ? Number(data.details.builtUpArea) : undefined,
          carpetArea: data.details.carpetArea ? Number(data.details.carpetArea) : undefined,
          totalFloors: data.details.totalFloors ? Number(data.details.totalFloors) : undefined,
          floorNumber: data.details.floorNumber ? Number(data.details.floorNumber) : undefined,
          parkingSpots: data.details.parkingSpots ? Number(data.details.parkingSpots) : undefined,
        },
        images: data.images || [],
        video: data.video,
        audioDescription: data.audioDescription,
        availability: data.availability || new Date().toISOString().split('T')[0],
        amenities: data.amenities || [],
        termsAndConditions: {
          agreementDuration: data.agreementDuration ? Number(data.agreementDuration) : undefined,
          noticePeriod: data.noticePeriod ? Number(data.noticePeriod) : undefined,
          brokerAllowed: data.brokerAllowed,
        },
        postedBy: {
          id: user.id,
          type: user.type as UserType,
          name: user.name,
          contactInfo: {
            email: user.email,
            phone: user.phone,
          },
        },
      };

      const newProperty = await addProperty(propertyData);

      toast({
        title: "Success!",
        description: "Property has been listed successfully",
      });

      navigate(`/property/${newProperty.id}`);
    } catch (error) {
      console.error("Error listing property:", error);
      toast({
        title: "Error",
        description: "Failed to list property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
