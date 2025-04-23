
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PropertyPurpose, PropertyType, FurnishingStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { addProperty } from "@/services/propertyService";
import { toast } from "@/hooks/use-toast";
import { PropertyTypeSection } from "./listing-form/PropertyTypeSection";
import { PropertyBasicDetails } from "./listing-form/PropertyBasicDetails";
import { PropertyLocation } from "./listing-form/PropertyLocation";
import { PropertyDetails } from "./listing-form/PropertyDetails";
import { PropertyDescription } from "./listing-form/PropertyDescription";

interface ListingFormProps {
  defaultPurpose?: PropertyPurpose;
}

const ListingForm = ({ defaultPurpose }: ListingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      purpose: defaultPurpose || "sell" as PropertyPurpose,
      type: "residential" as PropertyType,
      subType: "",
      price: "",
      description: "",
      location: {
        city: "",
        locality: "",
        address: "",
        pincode: "",
      },
      details: {
        bedrooms: "",
        bathrooms: "",
        furnishing: "unfurnished" as FurnishingStatus,
        carpetArea: "",
      },
    },
  });

  const onSubmit = async (data: any) => {
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

      const propertyData = {
        ...data,
        price: Number(data.price),
        location: {
          ...data.location,
          city: data.location.city,
          locality: data.location.locality,
          address: data.location.address,
          pincode: data.location.pincode,
        },
        details: {
          bedrooms: data.details.bedrooms ? Number(data.details.bedrooms) : undefined,
          bathrooms: data.details.bathrooms ? Number(data.details.bathrooms) : undefined,
          furnishing: data.details.furnishing as FurnishingStatus,
          carpetArea: data.details.carpetArea ? Number(data.details.carpetArea) : undefined,
        },
        images: [],
        amenities: [],
        postedBy: {
          id: user.id,
          type: user.type,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PropertyBasicDetails />
        <PropertyTypeSection />
        <PropertyLocation />
        <PropertyDetails />
        <PropertyDescription />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "List Property"}
        </Button>
      </form>
    </Form>
  );
};

export default ListingForm;
