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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface ListingFormProps {
  defaultPurpose?: PropertyPurpose;
  propertyId?: string;
}

const ListingForm = ({ defaultPurpose, propertyId }: ListingFormProps) => {
  const {
    form,
    currentStep,
    propertyScore,
    handleNextStep,
    handlePrevStep,
    isLoading,
    isEditMode
  } = useListingForm(defaultPurpose, propertyId);
  
  const { 
    handleSubmit, 
    isSubmitting, 
    showThankYouDialog, 
    handleViewProperty, 
    handleReturnHome 
  } = useListingSubmit(propertyId);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

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
                {isSubmitting ? 
                  (isEditMode ? "Updating..." : "Submitting...") : 
                  (isEditMode ? "Update Property" : "List Property")
                }
              </Button>
            )}
          </div>
        </form>

        {/* Thank You Dialog */}
        <Dialog open={showThankYouDialog} onOpenChange={() => false}>
          <DialogContent>
            <DialogHeader>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <DialogTitle className="text-2xl">Thank You!</DialogTitle>
                <DialogDescription className="mt-2 text-lg">
                  {isEditMode 
                    ? "Your property has been successfully updated."
                    : "Your property has been successfully listed."
                  }
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleReturnHome} variant="outline" className="flex-1">
                Return to Home
              </Button>
              <Button onClick={handleViewProperty} className="flex-1">
                View Your Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  );
};

export default ListingForm;
