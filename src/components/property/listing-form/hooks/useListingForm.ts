
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListingFormValues } from "../types";
import { formSchema } from "../schema";
import { PropertyPurpose, PropertyType } from "@/types"; // Added PropertyType import here

export const useListingForm = (defaultPurpose?: PropertyPurpose) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyScore, setPropertyScore] = useState(0);

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
  };
};
