
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/data/mockData";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  className?: string;
  onSearch?: (filters: any) => void;
}

export function SearchFilters({ className, onSearch }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    purpose: "buy",
    propertyType: "residential",
    subType: "",
    bedrooms: [],
    bathrooms: [],
    furnishing: [],
    budget: [0, 10000000],
    area: [0, 5000],
    postedBy: [],
    amenities: [],
  });

  const handleFilterChange = (category: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFilters((prev) => {
      const current = [...(prev[category as keyof typeof prev] as string[])];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return {
        ...prev,
        [category]: current,
      };
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ searchTerm, ...filters });
    }
  };

  const clearFilters = () => {
    setFilters({
      purpose: "buy",
      propertyType: "residential",
      subType: "",
      bedrooms: [],
      bathrooms: [],
      furnishing: [],
      budget: [0, 10000000],
      area: [0, 5000],
      postedBy: [],
      amenities: [],
    });
    setSearchTerm("");
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className={className}>
      {/* Main search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by locality, landmark, project, or builder"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md w-[90vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Property Filters</SheetTitle>
              <SheetDescription>
                Customize your search with specific property requirements
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6">
              <Tabs defaultValue={filters.purpose} onValueChange={(value) => handleFilterChange("purpose", value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="rent">Rent</TabsTrigger>
                  <TabsTrigger value="pg">PG</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mt-6">
              <Tabs defaultValue={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="residential">Residential</TabsTrigger>
                  <TabsTrigger value="commercial">Commercial</TabsTrigger>
                </TabsList>
                
                <TabsContent value="residential" className="mt-4">
                  <Label className="text-sm font-medium">Property Type</Label>
                  <Select 
                    value={filters.subType as string} 
                    onValueChange={(value) => handleFilterChange("subType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.residentialType.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                
                <TabsContent value="commercial" className="mt-4">
                  <Label className="text-sm font-medium">Property Type</Label>
                  <Select 
                    value={filters.subType as string} 
                    onValueChange={(value) => handleFilterChange("subType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.commercialType.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
              </Tabs>
            </div>

            <Accordion type="multiple" className="mt-6">
              {/* Budget Filter */}
              <AccordionItem value="budget">
                <AccordionTrigger>Budget</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Price Range</Label>
                      <Slider
                        defaultValue={filters.budget}
                        min={0}
                        max={10000000}
                        step={100000}
                        value={filters.budget as number[]}
                        onValueChange={(value) => handleFilterChange("budget", value)}
                        className="pt-5"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{formatPrice(filters.budget[0])}</span>
                        <span>{formatPrice(filters.budget[1])}</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Bedrooms Filter */}
              {filters.propertyType === "residential" && (
                <AccordionItem value="bedrooms">
                  <AccordionTrigger>Bedrooms</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.bedrooms.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={(filters.bedrooms as string[]).includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCheckboxChange("bedrooms", option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Bathrooms Filter */}
              {filters.propertyType === "residential" && (
                <AccordionItem value="bathrooms">
                  <AccordionTrigger>Bathrooms</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.bathrooms.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={(filters.bathrooms as string[]).includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCheckboxChange("bathrooms", option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Furnishing Filter */}
              <AccordionItem value="furnishing">
                <AccordionTrigger>Furnishing</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {filterOptions.furnishing.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`furnishing-${option.value}`} 
                          checked={(filters.furnishing as string[]).includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) handleCheckboxChange("furnishing", option.value);
                            else handleCheckboxChange("furnishing", option.value);
                          }}
                        />
                        <label
                          htmlFor={`furnishing-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Area Filter */}
              <AccordionItem value="area">
                <AccordionTrigger>Area</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Area Range (sq.ft)</Label>
                      <Slider
                        defaultValue={filters.area}
                        min={0}
                        max={5000}
                        step={100}
                        value={filters.area as number[]}
                        onValueChange={(value) => handleFilterChange("area", value)}
                        className="pt-5"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{filters.area[0]} sq.ft</span>
                        <span>{filters.area[1]} sq.ft</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Posted By Filter */}
              <AccordionItem value="postedBy">
                <AccordionTrigger>Posted By</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {filterOptions.postedBy.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`postedBy-${option.value}`} 
                          checked={(filters.postedBy as string[]).includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) handleCheckboxChange("postedBy", option.value);
                            else handleCheckboxChange("postedBy", option.value);
                          }}
                        />
                        <label
                          htmlFor={`postedBy-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Amenities Filter */}
              <AccordionItem value="amenities">
                <AccordionTrigger>Amenities</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.amenities.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${option.value}`} 
                          checked={(filters.amenities as string[]).includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) handleCheckboxChange("amenities", option.value);
                            else handleCheckboxChange("amenities", option.value);
                          }}
                        />
                        <label
                          htmlFor={`amenity-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <SheetFooter className="mt-6 flex-row gap-2 justify-between">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" /> Clear All
              </Button>
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Horizontal filters */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide">
        {/* Property Purpose */}
        <Select 
          value={filters.purpose} 
          onValueChange={(value) => handleFilterChange("purpose", value)}
        >
          <SelectTrigger className="min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.propertyPurpose.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Type */}
        <Select 
          value={filters.propertyType} 
          onValueChange={(value) => handleFilterChange("propertyType", value)}
        >
          <SelectTrigger className="min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.propertyType.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Budget Range */}
        <Select>
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-4">
              <Label className="text-sm mb-2 block">Price Range</Label>
              <Slider
                defaultValue={filters.budget}
                min={0}
                max={10000000}
                step={100000}
                value={filters.budget as number[]}
                onValueChange={(value) => handleFilterChange("budget", value)}
                className="pt-5 px-2"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatPrice(filters.budget[0])}</span>
                <span>{formatPrice(filters.budget[1])}</span>
              </div>
            </div>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        {filters.propertyType === "residential" && (
          <Select>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.bedrooms.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={(filters.bedrooms as string[]).includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCheckboxChange("bedrooms", option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
        )}

        {/* Furnishing */}
        <Select>
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="Furnishing" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-1">
              {filterOptions.furnishing.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-2">
                  <Checkbox 
                    id={`inline-furnishing-${option.value}`} 
                    checked={(filters.furnishing as string[]).includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) handleCheckboxChange("furnishing", option.value);
                      else handleCheckboxChange("furnishing", option.value);
                    }}
                  />
                  <label
                    htmlFor={`inline-furnishing-${option.value}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </SelectContent>
        </Select>

        {/* More Filters Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Additional Filters</SheetTitle>
              <SheetDescription>
                Refine your search with more specific requirements
              </SheetDescription>
            </SheetHeader>
            
            <Accordion type="multiple" className="mt-6">
              {/* Bathrooms Filter */}
              {filters.propertyType === "residential" && (
                <AccordionItem value="bathrooms">
                  <AccordionTrigger>Bathrooms</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.bathrooms.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={(filters.bathrooms as string[]).includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCheckboxChange("bathrooms", option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Area Filter */}
              <AccordionItem value="area">
                <AccordionTrigger>Area</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Area Range (sq.ft)</Label>
                      <Slider
                        defaultValue={filters.area}
                        min={0}
                        max={5000}
                        step={100}
                        value={filters.area as number[]}
                        onValueChange={(value) => handleFilterChange("area", value)}
                        className="pt-5"
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{filters.area[0]} sq.ft</span>
                        <span>{filters.area[1]} sq.ft</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Posted By Filter */}
              <AccordionItem value="postedBy">
                <AccordionTrigger>Posted By</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {filterOptions.postedBy.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sheet-postedBy-${option.value}`} 
                          checked={(filters.postedBy as string[]).includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) handleCheckboxChange("postedBy", option.value);
                            else handleCheckboxChange("postedBy", option.value);
                          }}
                        />
                        <label
                          htmlFor={`sheet-postedBy-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Amenities Filter */}
              <AccordionItem value="amenities">
                <AccordionTrigger>Amenities</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.amenities.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sheet-amenity-${option.value}`} 
                          checked={(filters.amenities as string[]).includes(option.value)}
                          onCheckedChange={(checked) => {
                            if (checked) handleCheckboxChange("amenities", option.value);
                            else handleCheckboxChange("amenities", option.value);
                          }}
                        />
                        <label
                          htmlFor={`sheet-amenity-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <SheetFooter className="mt-6 flex-row gap-2 justify-between">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
              <Button onClick={handleSearch} className="w-full">
                <Search className="mr-2 h-4 w-4" /> Apply
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.bedrooms.length > 0 && (
          <Badge variant="secondary" className="px-2 py-1">
            {filters.bedrooms.length} Bedroom{filters.bedrooms.length > 1 ? 's' : ''}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0 text-muted-foreground"
              onClick={() => handleFilterChange("bedrooms", [])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {filters.furnishing.length > 0 && (
          <Badge variant="secondary" className="px-2 py-1">
            {filters.furnishing.length} Furnishing Type{filters.furnishing.length > 1 ? 's' : ''}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0 text-muted-foreground"
              onClick={() => handleFilterChange("furnishing", [])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {(filters.budget[0] > 0 || filters.budget[1] < 10000000) && (
          <Badge variant="secondary" className="px-2 py-1">
            Budget: {formatPrice(filters.budget[0])} - {formatPrice(filters.budget[1])}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0 text-muted-foreground"
              onClick={() => handleFilterChange("budget", [0, 10000000])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {(filters.area[0] > 0 || filters.area[1] < 5000) && (
          <Badge variant="secondary" className="px-2 py-1">
            Area: {filters.area[0]} - {filters.area[1]} sq.ft
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0 text-muted-foreground"
              onClick={() => handleFilterChange("area", [0, 5000])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {filters.amenities.length > 0 && (
          <Badge variant="secondary" className="px-2 py-1">
            {filters.amenities.length} Amenity{filters.amenities.length > 1 ? 'ies' : 'y'}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 p-0 text-muted-foreground"
              onClick={() => handleFilterChange("amenities", [])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        
        {((filters.bedrooms.length > 0) || 
          (filters.furnishing.length > 0) || 
          (filters.budget[0] > 0 || filters.budget[1] < 10000000) || 
          (filters.area[0] > 0 || filters.area[1] < 5000) || 
          (filters.amenities.length > 0)) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
