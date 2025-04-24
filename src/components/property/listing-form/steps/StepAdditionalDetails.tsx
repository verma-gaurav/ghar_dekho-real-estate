
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

export const StepAdditionalDetails = () => {
  const form = useFormContext();
  const propertyPurpose = form.watch("purpose");
  
  // List of amenities for selection
  const amenitiesList = [
    { id: "lift", label: "Lift" },
    { id: "powerBackup", label: "Power Backup" },
    { id: "security", label: "Security" },
    { id: "swimmingPool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "park", label: "Park" },
    { id: "clubhouse", label: "Club House" },
    { id: "rainwaterHarvesting", label: "Rainwater Harvesting" },
    { id: "wasteDisposal", label: "Waste Disposal" },
    { id: "internet", label: "Internet/Wi-Fi" },
    { id: "gasPipeline", label: "Gas Pipeline" },
    { id: "fireAlarm", label: "Fire Alarm" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Step 5: Additional Details</div>
      
      {/* Price Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {propertyPurpose === "sell" ? "Price Details" : "Rent Details"}
        </h3>
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {propertyPurpose === "sell" ? "Expected Price" : "Monthly Rent"}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-8"
                    placeholder={propertyPurpose === "sell" ? "Enter price" : "Enter monthly rent"} 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceInWords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price in Words</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ten Lakh Fifty Thousand" {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount in words to avoid any confusion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Negotiable Option */}
        <FormField
          control={form.control}
          name="priceNegotiable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Price is negotiable</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Additional Charges (For Rentals) */}
        {propertyPurpose === "rent" && (
          <div className="space-y-3 border rounded-lg p-4">
            <h4 className="font-medium text-sm">Additional Charges</h4>
            
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="additionalCharges.electricity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Electricity charges included in rent</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalCharges.water"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Water charges included in rent</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalCharges.maintenance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Maintenance charges included in rent</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Security Deposit (For Rentals) */}
        {propertyPurpose === "rent" && (
          <FormField
            control={form.control}
            name="securityDeposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Security Deposit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Security deposit amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Agreement Type (For Rentals) */}
        {propertyPurpose === "rent" && (
          <FormField
            control={form.control}
            name="agreementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Agreement Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agreement type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="company">Company Lease Agreement</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Agreement Duration (For Rentals) */}
        {propertyPurpose === "rent" && (
          <FormField
            control={form.control}
            name="agreementDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agreement Duration (months)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Notice Period (For Rentals) */}
        {propertyPurpose === "rent" && (
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period (months)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="2">2 months</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Broker Contact Permission (For Rentals) */}
        {propertyPurpose === "rent" && (
          <FormField
            control={form.control}
            name="brokerAllowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Brokers may contact me</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Parking Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Parking</h3>
        
        <FormField
          control={form.control}
          name="details.parking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Availability</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="covered" id="parking-covered" />
                    <Label htmlFor="parking-covered">Covered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open" id="parking-open" />
                    <Label htmlFor="parking-open">Open</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="parking-both" />
                    <Label htmlFor="parking-both">Both</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="parking-none" />
                    <Label htmlFor="parking-none">None</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("details.parking") !== "none" && (
          <FormField
            control={form.control}
            name="details.parkingSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Parking Spots</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Number of spots" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Amenities</h3>
        <FormDescription>
          Select all amenities available at the property
        </FormDescription>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map((amenity) => (
            <FormField
              key={amenity.id}
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(amenity.id)}
                      onCheckedChange={(checked) => {
                        const currentAmenities = field.value || [];
                        if (checked) {
                          field.onChange([...currentAmenities, amenity.id]);
                        } else {
                          field.onChange(
                            currentAmenities.filter((value) => value !== amenity.id)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {amenity.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* Property Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Description</h3>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormDescription>
                Provide a detailed description of your property. Highlight unique features, location benefits, etc.
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="Describe your property" 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
