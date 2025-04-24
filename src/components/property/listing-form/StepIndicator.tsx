
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  propertyScore: number;
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
  propertyScore,
}: StepIndicatorProps) => {
  const steps = [
    "Basic Details",
    "Location Details",
    "Property Profile",
    "Media Upload",
    "Additional Details",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-10 rounded-full transition-all",
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium text-primary">{propertyScore}%</span> complete
        </div>
      </div>

      <ul className="grid w-full grid-cols-5">
        {steps.map((step, index) => (
          <li key={index} className="relative">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                  index + 1 === currentStep
                    ? "border-primary bg-primary text-white"
                    : index + 1 < currentStep
                      ? "border-primary bg-primary text-white"
                      : "border-muted bg-background text-muted-foreground"
                )}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-1 hidden text-xs md:block",
                  index + 1 === currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-[calc(50%+1rem)] top-4 hidden h-[2px] w-[calc(100%-2rem)] md:block",
                  index + 1 < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
