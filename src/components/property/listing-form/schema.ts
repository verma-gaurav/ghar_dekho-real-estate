import * as z from "zod";

export const formSchema = z.object({
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
