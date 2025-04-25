import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListingFormValues } from "../types";
import { formSchema } from "../schema";
import { PropertyPurpose, PropertyType } from "@/types";
import { getPropertyById } from "@/services/propertyService";
import { toast } from "@/components/ui/sonner";

export const useListingForm = (defaultPurpose?: PropertyPurpose, propertyId?: string) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyScore, setPropertyScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!propertyId);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      purpose: defaultPurpose || "sell" as PropertyPurpose,
      type: "residential" as PropertyType,
      subType: "",
      location: {
        city: "",
        locality: "",
        subLocality: "",
        society: "",
        address: "",
        pincode: "",
      },
      details: {
        bedrooms: "",
        bathrooms: "",
        balconies: "",
        plotArea: "",
        builtUpArea: "",
        carpetArea: "",
        furnishing: "unfurnished",
        furnishingDetails: {},
        totalFloors: "",
        floorNumber: "",
        age: "0-1",
        facing: "east",
        parking: "none",
        parkingSpots: "",
      },
      price: "",
      securityDeposit: "",
      priceInWords: "",
      priceNegotiable: false,
      additionalCharges: {
        electricity: false,
        water: false,
        maintenance: false,
      },
      agreementType: "any",
      brokerAllowed: true,
      description: "",
      availability: new Date().toISOString().split('T')[0],
      tenantPreference: "any",
      images: [],
      coverImageIndex: 0,
      video: "",
      audioDescription: "",
      amenities: [],
      agreementDuration: "12",
      noticePeriod: "1",
    }
  });

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (propertyId) {
        try {
          setIsLoading(true);
          const property = await getPropertyById(propertyId);
          
          // Convert property data to form values
          form.reset({
            title: property.title,
            purpose: property.purpose,
            type: property.type,
            subType: property.subType,
            location: {
              city: property.location.city,
              locality: property.location.locality,
              subLocality: property.location.subLocality || '',
              society: property.location.society || '',
              address: property.location.address,
              pincode: property.location.pincode,
            },
            details: {
              bedrooms: property.details.bedrooms?.toString() || '',
              bathrooms: property.details.bathrooms?.toString() || '',
              balconies: property.details.balconies?.toString() || '',
              plotArea: property.details.plotArea?.toString() || '',
              builtUpArea: property.details.builtUpArea?.toString() || '',
              carpetArea: property.details.carpetArea?.toString() || '',
              furnishing: property.details.furnishing,
              furnishingDetails: property.details.furnishingDetails || {},
              totalFloors: property.details.totalFloors?.toString() || '',
              floorNumber: property.details.floorNumber?.toString() || '',
              age: property.details.age,
              facing: property.details.facing || 'east',
              parking: property.details.parking,
              parkingSpots: property.details.parkingSpots?.toString() || '',
            },
            price: property.price.toString(),
            securityDeposit: property.securityDeposit?.toString() || '',
            description: property.description,
            availability: property.availability || new Date().toISOString().split('T')[0],
            images: property.images || [],
            video: property.video || '',
            audioDescription: property.audioDescription || '',
            amenities: property.amenities || [],
            agreementDuration: property.termsAndConditions?.agreementDuration?.toString() || '12',
            noticePeriod: property.termsAndConditions?.noticePeriod?.toString() || '1',
            brokerAllowed: property.termsAndConditions?.brokerAllowed !== undefined 
              ? property.termsAndConditions.brokerAllowed 
              : true,
          });
          
          calculatePropertyScore();
        } catch (error) {
          console.error('Error fetching property data:', error);
          toast("Failed to load property data for editing");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPropertyData();
  }, [propertyId, form]);

  const calculatePropertyScore = () => {
    let score = 0;
    const formValues = form.getValues();
    
    // Basic Details (20%)
    if (formValues.title && formValues.purpose && formValues.type && formValues.subType) {
      score += 20;
    }
    
    // Location Details (20%)
    if (formValues.location.city && formValues.location.locality && formValues.location.address) {
      score += 20;
    }
    
    // Property Profile (20%)
    if (formValues.details.furnishing) {
      score += 10;
      if ((formValues.type === "residential" && formValues.details.bedrooms && formValues.details.bathrooms) || 
          (formValues.type === "commercial" && formValues.details.carpetArea)) {
        score += 10;
      }
    }
    
    // Additional Details (20%)
    if (formValues.price && formValues.description) {
      score += 20;
    }
    
    // Media Upload (20%)
    if (formValues.images && formValues.images.length > 0) {
      score += 20;
    }
    
    setPropertyScore(score);
    return score;
  };

  const handleNextStep = async () => {
    let formValid = false;
    
    // Validate fields based on current step
    if (currentStep === 1) {
      const result = await form.trigger(["title", "purpose", "type", "subType"]);
      formValid = result;
    } else if (currentStep === 2) {
      const result = await form.trigger(["location.city", "location.locality", "location.address", "location.pincode"]);
      formValid = result;
    } else if (currentStep === 3) {
      const propertyType = form.getValues("type");
      if (propertyType === "residential") {
        const result = await form.trigger([
          "details.bedrooms", "details.bathrooms", "details.furnishing", "details.carpetArea"
        ]);
        formValid = result;
      } else {
        const result = await form.trigger(["details.furnishing", "details.carpetArea"]);
        formValid = result;
      }
    } else if (currentStep === 4) {
      // Media upload is optional, so we'll allow proceeding regardless
      formValid = true;
    } else if (currentStep === 5) {
      const result = await form.trigger(["price", "description"]);
      formValid = result;
    }
    
    if (formValid) {
      calculatePropertyScore();
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    form,
    currentStep,
    propertyScore,
    handleNextStep,
    handlePrevStep,
    isLoading,
    isEditMode
  };
};
