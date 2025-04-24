import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addProperty } from "@/services/propertyService";
import { 
  PropertyPurpose, 
  PropertyType, 
  ResidentialType, 
  CommercialType 
} from "@/types";
import { StepBasicDetails } from "./listing-form/steps/StepBasicDetails";
import { StepLocationDetails } from "./listing-form/steps/StepLocationDetails";
import { StepPropertyProfile } from "./listing-form/steps/StepPropertyProfile";
import { StepAdditionalDetails } from "./listing-form/steps/StepAdditionalDetails";
import { StepMediaUpload } from "./listing-form/steps/StepMediaUpload";
import { StepIndicator } from "./listing-form/StepIndicator";

interface ListingFormProps {
  defaultPurpose?: PropertyPurpose;
}

// Define the form schema with Zod
const formSchema = z.object({
  // Basic Details
  title: z.string().min(1, "Property title is required"),
  purpose: z.enum(["sell", "rent", "pg"]),
  type: z.enum(["residential", "commercial"]),
  subType: z.string().min(1, "Property sub-type is required"),
  
  // Location Details
  location: z.object({
    city: z.string().min(1, "City is required"),
    locality: z.string().min(1, "Locality is required"),
    subLocality: z.string().optional(),
    society: z.string().optional(),
    address: z.string().min(1, "Complete address is required"),
    pincode: z.string().min(1, "Pin code is required"),
  }),
  
  // Property Profile
  details: z.object({
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    balconies: z.string().optional(),
    plotArea: z.string().optional(),
    builtUpArea: z.string().optional(),
    carpetArea: z.string().optional(),
    furnishing: z.enum(["furnished", "semi-furnished", "unfurnished"]),
    furnishingDetails: z.record(z.union([z.number(), z.boolean()])).optional(),
    totalFloors: z.string().optional(),
    floorNumber: z.string().optional(),
    age: z.enum(["0-1", "1-5", "5-10", "10+", "new-launch"]).optional(),
    facing: z.enum(["east", "west", "north", "south", "northeast", "northwest", "southeast", "southwest"]).optional(),
    parking: z.enum(["covered", "open", "both", "none"]).optional(),
    parkingSpots: z.string().optional(),
  }),
  
  // Additional Details
  price: z.string().min(1, "Price is required"),
  securityDeposit: z.string().optional(),
  priceInWords: z.string().optional(),
  priceNegotiable: z.boolean().optional(),
  additionalCharges: z.object({
    electricity: z.boolean().optional(),
    water: z.boolean().optional(),
    maintenance: z.boolean().optional(),
  }).optional(),
  agreementType: z.enum(["company", "any"]).optional(),
  brokerAllowed: z.boolean().optional(),
  description: z.string().min(1, "Description is required"),
  availability: z.string().optional(),
  tenantPreference: z.enum(["family", "men", "women", "any"]).optional(),
  
  // Media Upload
  images: z.array(z.string()).optional(),
  coverImageIndex: z.number().optional(),
  video: z.string().optional(),
  audioDescription: z.string().optional(),
  
  // Additional Details
  amenities: z.array(z.string()).optional(),
  agreementDuration: z.string().optional(),
  noticePeriod: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ListingForm = ({ defaultPurpose }: ListingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyScore, setPropertyScore] = useState(0);
  
  // Initialize form with default values
  const form = useForm<FormValues>({
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

  // Calculate property score based on form completeness
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

  // Next step handler
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

  // Previous step handler
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
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
      
      // Process form data for submission
      // Ensure subType is properly typed based on property type
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
        location: {
          city: data.location.city,
          locality: data.location.locality,
          subLocality: data.location.subLocality,
          society: data.location.society,
          address: data.location.address,
          pincode: data.location.pincode,
        },
        details: {
          bedrooms: data.details.bedrooms ? Number(data.details.bedrooms) : undefined,
          bathrooms: data.details.bathrooms ? Number(data.details.bathrooms) : undefined,
          balconies: data.details.balconies ? Number(data.details.balconies) : undefined,
          plotArea: data.details.plotArea ? Number(data.details.plotArea) : undefined,
          builtUpArea: data.details.builtUpArea ? Number(data.details.builtUpArea) : undefined,
          carpetArea: data.details.carpetArea ? Number(data.details.carpetArea) : undefined,
          furnishing: data.details.furnishing,
          furnishingDetails: data.details.furnishingDetails,
          totalFloors: data.details.totalFloors ? Number(data.details.totalFloors) : undefined,
          floorNumber: data.details.floorNumber ? Number(data.details.floorNumber) : undefined,
          age: data.details.age,
          facing: data.details.facing,
          parking: data.details.parking,
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

  // Get current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicDetails />;
      case 2:
        return <StepLocationDetails />;
      case 3:
        return <StepPropertyProfile />;
      case 4:
        return <StepMediaUpload />;
      case 5:
        return <StepAdditionalDetails />;
      default:
        return <StepBasicDetails />;
    }
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* Step indicator */}
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={5} 
          propertyScore={propertyScore} 
        />
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-4">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 5 ? (
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "List Property"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default ListingForm;
