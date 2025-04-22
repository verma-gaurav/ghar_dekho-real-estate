
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AdvancedFiltersProps {
  purpose: "buy" | "rent" | "pg" | "commercial";
  onApplyFilters: (filters: any) => void;
}

export function AdvancedFilters({ purpose, onApplyFilters }: AdvancedFiltersProps) {
  const [budget, setBudget] = useState<[number, number]>(
    purpose === "buy" ? [500000, 10000000] : purpose === "rent" ? [5000, 100000] : [3000, 30000]
  );
  const [area, setArea] = useState<[number, number]>([500, 5000]);
  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [bathrooms, setBathrooms] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState<string[]>([]);
  const [postedBy, setPostedBy] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  
  // Budget ranges based on purpose
  const budgetRanges = {
    buy: [500000, 50000000],
    rent: [5000, 500000],
    pg: [3000, 50000],
    commercial: [10000, 1000000]
  };
  
  const currentBudgetRange = budgetRanges[purpose] || budgetRanges.rent;
  
  // Format budget display based on value
  const formatBudget = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} Lac`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    } else {
      return `${value}`;
    }
  };
  
  // Format area display
  const formatArea = (value: number) => {
    return `${value} sq.ft`;
  };

  // Toggle bedroom selection
  const toggleBedroom = (value: string) => {
    if (bedrooms.includes(value)) {
      setBedrooms(bedrooms.filter(b => b !== value));
    } else {
      setBedrooms([...bedrooms, value]);
    }
  };
  
  // Toggle bathroom selection
  const toggleBathroom = (value: string) => {
    if (bathrooms.includes(value)) {
      setBathrooms(bathrooms.filter(b => b !== value));
    } else {
      setBathrooms([...bathrooms, value]);
    }
  };
  
  // Toggle furnishing selection
  const toggleFurnishing = (value: string) => {
    if (furnishing.includes(value)) {
      setFurnishing(furnishing.filter(f => f !== value));
    } else {
      setFurnishing([...furnishing, value]);
    }
  };
  
  // Toggle posted by selection
  const togglePostedBy = (value: string) => {
    if (postedBy.includes(value)) {
      setPostedBy(postedBy.filter(p => p !== value));
    } else {
      setPostedBy([...postedBy, value]);
    }
  };
  
  // Toggle amenities selection
  const toggleAmenity = (value: string) => {
    if (amenities.includes(value)) {
      setAmenities(amenities.filter(a => a !== value));
    } else {
      setAmenities([...amenities, value]);
    }
  };
  
  // Apply all filters
  const applyFilters = () => {
    const filters = {
      purpose,
      budget,
      area,
      bedrooms,
      bathrooms,
      furnishing,
      postedBy,
      amenities
    };
    onApplyFilters(filters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setBudget(currentBudgetRange as [number, number]);
    setArea([500, 5000]);
    setBedrooms([]);
    setBathrooms([]);
    setFurnishing([]);
    setPostedBy([]);
    setAmenities([]);
  };
  
  // Common amenities list
  const commonAmenities = [
    "Lift",
    "Power Backup",
    "Security",
    "Swimming Pool",
    "Gym",
    "Park",
    "Club House",
    "Wi-Fi",
    "Children's Play Area",
    "Indoor Games",
    "Gas Pipeline",
    "Rainwater Harvesting",
  ];

  return (
    <div className="space-y-6">
      {/* Budget Slider */}
      <div>
        <h3 className="font-medium mb-3">Budget</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={budget}
            min={currentBudgetRange[0]}
            max={currentBudgetRange[1]}
            step={purpose === "buy" ? 100000 : 1000}
            value={budget}
            onValueChange={(value) => setBudget(value as [number, number])}
            className="py-4"
          />
          <div className="flex justify-between text-sm">
            <div>₹{formatBudget(budget[0])}</div>
            <div>₹{formatBudget(budget[1])}</div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Property Type Selection for Residential */}
      {(purpose === "buy" || purpose === "rent") && (
        <div>
          <h3 className="font-medium mb-3">Property Type</h3>
          <Select defaultValue="residential">
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Bedrooms (only for residential properties) */}
      {(purpose === "buy" || purpose === "rent") && (
        <div>
          <h3 className="font-medium mb-3">Bedrooms</h3>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5+"].map((value) => (
              <Button
                key={value}
                variant={bedrooms.includes(value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBedroom(value)}
                className="min-w-16"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Bathrooms (only for residential properties) */}
      {(purpose === "buy" || purpose === "rent") && (
        <div>
          <h3 className="font-medium mb-3">Bathrooms</h3>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5+"].map((value) => (
              <Button
                key={value}
                variant={bathrooms.includes(value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBathroom(value)}
                className="min-w-16"
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Separator />
      
      {/* Area Range Slider */}
      <div>
        <h3 className="font-medium mb-3">Area</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={area}
            min={100}
            max={10000}
            step={100}
            value={area}
            onValueChange={(value) => setArea(value as [number, number])}
            className="py-4"
          />
          <div className="flex justify-between text-sm">
            <div>{formatArea(area[0])}</div>
            <div>{formatArea(area[1])}</div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Furnishing Status */}
      <div>
        <h3 className="font-medium mb-3">Furnishing</h3>
        <div className="space-y-2">
          {[
            { id: "furnished", label: "Furnished" },
            { id: "semi-furnished", label: "Semi-Furnished" },
            { id: "unfurnished", label: "Unfurnished" }
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={option.id}
                checked={furnishing.includes(option.id)}
                onCheckedChange={() => toggleFurnishing(option.id)}
              />
              <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Posted By */}
      <div>
        <h3 className="font-medium mb-3">Posted By</h3>
        <div className="space-y-2">
          {[
            { id: "owner", label: "Owner" },
            { id: "builder", label: "Builder" },
            { id: "agent", label: "Agent" }
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`posted-${option.id}`}
                checked={postedBy.includes(option.id)}
                onCheckedChange={() => togglePostedBy(option.id)}
              />
              <Label htmlFor={`posted-${option.id}`} className="font-normal">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Amenities (collapsible) */}
      <Collapsible>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Amenities</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-3">
          <div className="grid grid-cols-2 gap-2">
            {commonAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox 
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm">{amenity}</Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="pt-4 flex gap-3">
        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
      </div>
    </div>
  );
}
