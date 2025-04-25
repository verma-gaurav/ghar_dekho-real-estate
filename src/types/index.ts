// Property Types
export type PropertyPurpose = "sell" | "rent" | "pg";
export type PropertyType = "residential" | "commercial";
export type ResidentialType = 
  | "flat" 
  | "house" 
  | "floor" 
  | "studio" 
  | "serviced" 
  | "farmhouse" 
  | "other";
export type CommercialType = 
  | "office" 
  | "shell" 
  | "retail" 
  | "commercial-land" 
  | "agriculture-land" 
  | "industrial-land" 
  | "warehouse" 
  | "cold-storage" 
  | "factory" 
  | "hotel" 
  | "other";
export type FurnishingStatus = "furnished" | "semi-furnished" | "unfurnished";
export type ConstructionStatus = "ready" | "under-construction" | "new-launch";
export type PropertyAge = "0-1" | "1-5" | "5-10" | "10+" | "new-launch";
export type TenantPreference = "family" | "men" | "women" | "any";
export type PropertyFacing = "east" | "west" | "north" | "south" | "northeast" | "northwest" | "southeast" | "southwest";
export type ParkingType = "covered" | "open" | "both" | "none";

// User Types
export type UserType = "owner" | "builder" | "agent";

// Property Interface
export interface Property {
  id: string;
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  subType: ResidentialType | CommercialType;
  price: number;
  securityDeposit?: number;
  location: {
    city: string;
    locality: string;
    subLocality?: string;
    society?: string;
    address: string;
    pincode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  details: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    plotArea?: number;
    builtUpArea?: number;
    carpetArea?: number;
    furnishing: FurnishingStatus;
    furnishingDetails?: {
      [key: string]: number | boolean;
    };
    totalFloors?: number;
    floorNumber?: number;
    age: PropertyAge;
    facing?: PropertyFacing;
    parking: ParkingType;
    parkingSpots?: number;
  };
  amenities: string[];
  description: string;
  images: string[];
  video?: string;
  audioDescription?: string;
  availability: string;
  postedBy: {
    id: string;
    type: UserType;
    name: string;
    contactInfo: {
      email: string;
      phone: string;
    };
  };
  termsAndConditions?: {
    agreementDuration?: number;
    noticePeriod?: number;
    brokerAllowed?: boolean;
  };
  createdAt: string;
  updatedAt: string;
  propertyScore: number;
  views: number;
  verification_status?: boolean;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  profilePicture?: string;
  savedProperties: string[];
  listedProperties: string[];
  inquiries: string[];
  savedSearches: string[];
  createdAt: string;
  updatedAt: string;
}
