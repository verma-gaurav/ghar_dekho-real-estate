
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { UserType, PropertyPurpose, PropertyType, ResidentialType, CommercialType, FurnishingStatus } from "@/types";
import database from "@/services/database";

// Basic form schema (we'll add more fields as we progress through steps)
const formSchema = z.object({
  // Step 1: Basic Details
  title: z.string().min(10, "Title must be at least 10 characters"),
  purpose: z.enum(["sell", "rent", "pg"] as const),
  type: z.enum(["residential", "commercial"] as const),
  subType: z.string(),
  
  // Step 2: Location Details
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  subLocality: z.string().optional(),
  society: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  
  // Step 3: Property Details
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  plotArea: z.number().optional(),
  builtUpArea: z.number().optional(),
  carpetArea: z.number().optional(),
  furnishing: z.enum(["furnished", "semi-furnished", "unfurnished"] as const),
  totalFloors: z.number().optional(),
  floorNumber: z.number().optional(),
  parking: z.enum(["covered", "open", "both", "none"] as const),
  parkingSpots: z.number().optional(),
  
  // Step 4: Pricing & Description
  price: z.number().min(1, "Price is required"),
  securityDeposit: z.number().optional(),
  description: z.string().min(30, "Description must be at least 30 characters"),
  
  // Step 5: Media & Amenities
  images: z.array(z.string()).min(1, "At least one image is required"),
  amenities: z.array(z.string()),
  
  // Posted by details
  postedByName: z.string().min(1, "Name is required"),
  postedByType: z.enum(["owner", "builder", "agent"] as const),
  postedByEmail: z.string().email("Invalid email address"),
  postedByPhone: z.string().min(10, "Invalid phone number"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  purpose: "sell",
  type: "residential",
  subType: "flat",
  furnishing: "unfurnished",
  parking: "none",
  images: [],
  amenities: [],
  postedByType: "owner",
};

export default function ListProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Get current form values
  const formValues = form.getValues();

  // Function to handle step navigation
  const nextStep = async () => {
    const currentStepFields: Record<number, string[]> = {
      1: ["title", "purpose", "type", "subType"],
      2: ["city", "locality", "address", "pincode"],
      3: ["furnishing", "parking"],
      4: ["price", "description"],
      5: ["postedByName", "postedByEmail", "postedByPhone"],
    };
    
    // Validate only the fields for current step
    const result = await form.trigger(currentStepFields[step] as any);
    
    if (result) {
      if (step < 5) {
        setStep(prev => prev + 1);
        setProgress(prev => prev + 20);
      } else {
        submitForm();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setProgress(prev => prev - 20);
    }
  };
  
  // Function to add a mock image
  const addMockImage = () => {
    const mockImages = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185009-5bf9f2849488?q=80&w=2070&auto=format&fit=crop",
    ];
    
    const newImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    
    if (!uploadedImages.includes(newImage)) {
      const updatedImages = [...uploadedImages, newImage];
      setUploadedImages(updatedImages);
      form.setValue("images", updatedImages);
    }
  };
  
  // Submit the form
  const submitForm = () => {
    if (!form.formState.isValid) {
      toast({
        title: "Form Invalid",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
      return;
    }
    
    const values = form.getValues();
    
    try {
      // Create property object
      const newProperty = {
        title: values.title,
        purpose: values.purpose as PropertyPurpose,
        type: values.type as PropertyType,
        subType: values.subType as ResidentialType | CommercialType,
        price: values.price,
        securityDeposit: values.securityDeposit,
        location: {
          city: values.city,
          locality: values.locality,
          subLocality: values.subLocality,
          society: values.society,
          address: values.address,
          pincode: values.pincode,
        },
        details: {
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          balconies: values.balconies,
          plotArea: values.plotArea,
          builtUpArea: values.builtUpArea,
          carpetArea: values.carpetArea,
          furnishing: values.furnishing as FurnishingStatus,
          totalFloors: values.totalFloors,
          floorNumber: values.floorNumber,
          age: "0-1" as const,
          parking: values.parking,
          parkingSpots: values.parkingSpots,
        },
        amenities: values.amenities || [],
        description: values.description,
        images: values.images,
        availability: "Immediate",
        postedBy: {
          id: "user1", // Hardcoded for demo
          type: values.postedByType as UserType,
          name: values.postedByName,
          contactInfo: {
            email: values.postedByEmail,
            phone: values.postedByPhone,
          },
        },
      };
      
      // Add to database
      const addedProperty = database.addProperty(newProperty);
      
      // Show success message
      toast({
        title: "Property Listed Successfully",
        description: "Your property has been added to our listings.",
      });
      
      // Redirect to property page
      navigate(`/property/${addedProperty.id}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to list your property. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Options for amenities
  const amenityOptions = [
    { id: "lift", label: "Lift" },
    { id: "power_backup", label: "Power Backup" },
    { id: "security", label: "Security" },
    { id: "swimming_pool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "park", label: "Park" },
    { id: "club_house", label: "Club House" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "children_play_area", label: "Children's Play Area" },
    { id: "indoor_games", label: "Indoor Games" },
    { id: "gas_pipeline", label: "Gas Pipeline" },
    { id: "rainwater_harvesting", label: "Rainwater Harvesting" },
  ];

  // Render the appropriate step form
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Spacious 3BHK Apartment in Prime Location" {...field} />
                  </FormControl>
                  <FormDescription>
                    A good title helps your property stand out.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sell" />
                        </FormControl>
                        <FormLabel className="font-normal">Sell</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="rent" />
                        </FormControl>
                        <FormLabel className="font-normal">Rent</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pg" />
                        </FormControl>
                        <FormLabel className="font-normal">PG/Co-living</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("type") === "residential" ? (
              <FormField
                control={form.control}
                name="subType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select residential type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flat">Flat/Apartment</SelectItem>
                        <SelectItem value="house">Independent House/Villa</SelectItem>
                        <SelectItem value="floor">Independent/Builder Floor</SelectItem>
                        <SelectItem value="studio">1 RK/Studio Apartment</SelectItem>
                        <SelectItem value="serviced">Serviced Apartment</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="subType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commercial Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commercial type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office">Ready to Move Office</SelectItem>
                        <SelectItem value="shell">Bare Shell Office</SelectItem>
                        <SelectItem value="retail">Shop & Retail</SelectItem>
                        <SelectItem value="commercial-land">Commercial/Institutional Land</SelectItem>
                        <SelectItem value="agriculture-land">Agricultural/Farm Land</SelectItem>
                        <SelectItem value="industrial-land">Industrial Land/Plot</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="factory">Factory & Manufacturing</SelectItem>
                        <SelectItem value="hotel">Hotel/Resort</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locality/Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter locality name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subLocality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Locality (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sub-locality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="society"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment/Society Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter society name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complete Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter full property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit pincode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {(form.watch("type") === "residential" && 
              ["flat", "house", "floor", "studio", "serviced"].includes(form.watch("subType"))) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="balconies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Balconies</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalFloors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Floors in Building</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(20)].map((_, i) => (
                              <SelectItem key={i} value={(i+1).toString()}>{i+1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="floorNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property on Floor</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...Array(20)].map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0 ? "Ground Floor" : `${i}${i === 1 ? "st" : i === 2 ? "nd" : i === 3 ? "rd" : "th"} Floor`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="plotArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plot Area (sq.ft)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter plot area" 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        value={field.value?.toString() || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="builtUpArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Built-up Area (sq.ft)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter built-up area" 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        value={field.value?.toString() || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="carpetArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carpet Area (sq.ft)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter carpet area" 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        value={field.value?.toString() || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="furnishing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnishing Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="furnished" />
                        </FormControl>
                        <FormLabel className="font-normal">Fully Furnished</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="semi-furnished" />
                        </FormControl>
                        <FormLabel className="font-normal">Semi-Furnished</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="unfurnished" />
                        </FormControl>
                        <FormLabel className="font-normal">Unfurnished</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="covered">Covered</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("parking") !== "none" && (
              <FormField
                control={form.control}
                name="parkingSpots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Parking Spots</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected {form.watch("purpose") === "sell" ? "Price" : "Rent"} (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter amount" 
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                      value={field.value?.toString() || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("purpose") === "rent" && (
              <FormField
                control={form.control}
                name="securityDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        value={field.value?.toString() || ''} 
                      />
                    </FormControl>
                    <FormDescription>
                      Usually 1-3 months of rent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property in detail including unique features, nearby amenities, etc." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description improves your property's visibility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <FormLabel>Upload Property Images</FormLabel>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                <div className="mb-4">
                  <Button type="button" onClick={addMockImage}>
                    + Add Property Image
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  JPG, PNG or GIF, Max size: 5MB each
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => {
                            const updatedImages = uploadedImages.filter((_, i) => i !== index);
                            setUploadedImages(updatedImages);
                            form.setValue("images", updatedImages);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Amenities</FormLabel>
                    <FormDescription>
                      Select amenities available with the property
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenityOptions.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={amenity.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.label)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, amenity.label]);
                                    } else {
                                      field.onChange(
                                        current.filter(
                                          (value) => value !== amenity.label
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {amenity.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 border-t">
              <FormField
                control={form.control}
                name="postedByName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="postedByEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postedByPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="postedByType"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>You are a</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="owner" />
                          </FormControl>
                          <FormLabel className="font-normal">Property Owner</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="builder" />
                          </FormControl>
                          <FormLabel className="font-normal">Builder</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="agent" />
                          </FormControl>
                          <FormLabel className="font-normal">Agent</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container">
        <Form {...form}>
          <form>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>List Your Property</CardTitle>
                <CardDescription>
                  Complete the form to list your property on our platform
                </CardDescription>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
              
              <CardContent>
                <Tabs value={step.toString()} className="w-full">
                  <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="1" disabled>Basic Details</TabsTrigger>
                    <TabsTrigger value="2" disabled>Location</TabsTrigger>
                    <TabsTrigger value="3" disabled>Property Details</TabsTrigger>
                    <TabsTrigger value="4" disabled>Price & Description</TabsTrigger>
                    <TabsTrigger value="5" disabled>Media & Contact</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    {renderStepContent()}
                  </div>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  {step === 5 ? "Submit Listing" : "Next"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
