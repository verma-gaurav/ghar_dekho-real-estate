
import { FormProvider } from "react-hook-form";
import { PropertyPurpose } from "@/types";
import { useListingForm } from "./listing-form/hooks/useListingForm";
import { useListingSubmit } from "./listing-form/hooks/useListingSubmit";
import { StepBasicDetails } from "./listing-form/steps/StepBasicDetails";
import { StepLocationDetails } from "./listing-form/steps/StepLocationDetails";
import { StepPropertyProfile } from "./listing-form/steps/StepPropertyProfile";
import { StepMediaUpload } from "./listing-form/steps/StepMediaUpload";
import { StepAdditionalDetails } from "./listing-form/steps/StepAdditionalDetails";
import { StepIndicator } from "./listing-form/StepIndicator";
import { Button } from "@/components/ui/button";

interface ListingFormProps {
  defaultPurpose?: PropertyPurpose;
}

const ListingForm = ({ defaultPurpose }: ListingFormProps) => {
  const {
    form,
    currentStep,
    propertyScore,
    handleNextStep,
    handlePrevStep,
  } = useListingForm(defaultPurpose);
  
  const { handleSubmit, isSubmitting } = useListingSubmit();

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
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={5} 
          propertyScore={propertyScore} 
        />
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
