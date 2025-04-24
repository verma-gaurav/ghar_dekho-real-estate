
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Bed, 
  Bath, 
  Calendar, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const StepPropertyProfile = () => {
  const form = useFormContext();
  const propertyType = form.watch("type");
  const furnishingType = form.watch("details.furnishing");
  
  const [showFurnishingDetails, setShowFurnishingDetails] = useState(false);

  // Function to handle quantity increases/decreases for furnishing items
  const handleQuantityChange = (item: string, increment: boolean) => {
    const currentValue = form.getValues(`details.furnishingDetails.${item}`) || 0;
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    
    form.setValue(`details.furnishingDetails.${item}`, newValue, { shouldValidate: true });
  };

  // Toggle function for boolean furnishing items
  const handleToggleFurnishingItem = (item: string) => {
    const currentValue = form.getValues(`details.furnishingDetails.${item}`) || false;
    form.setValue(`details.furnishingDetails.${item}`, !currentValue, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Step 3: Property Profile</div>
      
      {/* Room Details Section (Only for Residential) */}
      {propertyType === "residential" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Room Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="details.bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bedrooms</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Bed className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="number" min="0" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bathrooms</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Bath className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="number" min="0" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Balconies</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "0"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of balconies" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">More than 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Area Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Area Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="details.plotArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plot Area (sq.ft)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Plot area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.builtUpArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Built-up Area (sq.ft)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Built-up area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.carpetArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carpet Area (sq.ft)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Carpet area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Furnishing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Furnishing</h3>
        
        <FormField
          control={form.control}
          name="details.furnishing"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="furnished" id="furnished" />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semi-furnished" id="semi-furnished" />
                    <Label htmlFor="semi-furnished">Semi-furnished</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unfurnished" id="unfurnished" />
                    <Label htmlFor="unfurnished">Unfurnished</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Furnishing Details (Only for Furnished/Semi-furnished) */}
        {(furnishingType === "furnished" || furnishingType === "semi-furnished") && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Furnishing Details</h4>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFurnishingDetails(!showFurnishingDetails)}
              >
                {showFurnishingDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {showFurnishingDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quantity Items */}
                  {["lights", "fans", "ac", "tv", "beds", "wardrobe", "geyser"].map((item) => (
                    <div key={item} className="flex items-center justify-between border rounded p-2">
                      <span className="capitalize">{item}</span>
                      <div className="flex items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="h-7 w-7 p-0" 
                          onClick={() => handleQuantityChange(item, false)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">
                          {form.getValues(`details.furnishingDetails.${item}`) || 0}
                        </span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="h-7 w-7 p-0" 
                          onClick={() => handleQuantityChange(item, true)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Boolean Items */}
                  {[
                    "sofa", "washingMachine", "stove", "fridge", "waterPurifier", 
                    "microwave", "modularKitchen", "chimney", "diningTable", "curtains", "exhaustFan"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item} 
                        checked={form.getValues(`details.furnishingDetails.${item}`) || false}
                        onCheckedChange={() => handleToggleFurnishingItem(item)} 
                      />
                      <label 
                        htmlFor={item}
                        className="capitalize text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item === "washingMachine" 
                          ? "Washing Machine" 
                          : item === "waterPurifier" 
                            ? "Water Purifier"
                            : item === "modularKitchen"
                              ? "Modular Kitchen"
                              : item === "diningTable"
                                ? "Dining Table"
                                : item === "exhaustFan"
                                  ? "Exhaust Fan"
                                  : item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floor Details (Only for relevant property types) */}
      {(propertyType === "residential" && form.watch("subType") !== "house" && form.watch("subType") !== "farmhouse") && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Floor Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="details.totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Floors in Building</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="Total floors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property on Floor Number</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Floor number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Property Age */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Age</h3>
        
        <FormField
          control={form.control}
          name="details.age"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-1" id="age-0-1" />
                    <Label htmlFor="age-0-1">0-1 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-5" id="age-1-5" />
                    <Label htmlFor="age-1-5">1-5 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5-10" id="age-5-10" />
                    <Label htmlFor="age-5-10">5-10 years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10+" id="age-10-plus" />
                    <Label htmlFor="age-10-plus">10+ years</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new-launch" id="age-new-launch" />
                    <Label htmlFor="age-new-launch">New Launch</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Availability</h3>
        
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available From</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>When will this property be available?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tenant Preferences (Only for Rent/PG) */}
      {(form.watch("purpose") === "rent" || form.watch("purpose") === "pg") && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tenant Preferences</h3>
          
          <FormField
            control={form.control}
            name="tenantPreference"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="family" id="tenant-family" />
                      <Label htmlFor="tenant-family">Family</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="men" id="tenant-men" />
                      <Label htmlFor="tenant-men">Single Men</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="women" id="tenant-women" />
                      <Label htmlFor="tenant-women">Single Women</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="tenant-any" />
                      <Label htmlFor="tenant-any">Any</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Property Facing */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Property Facing</h3>
        
        <FormField
          control={form.control}
          name="details.facing"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    "east", "west", "north", "south",
                    "northeast", "northwest", "southeast", "southwest"
                  ].map((direction) => (
                    <div key={direction} className="flex items-center space-x-2">
                      <RadioGroupItem value={direction} id={`facing-${direction}`} />
                      <Label htmlFor={`facing-${direction}`} className="capitalize">{direction}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
