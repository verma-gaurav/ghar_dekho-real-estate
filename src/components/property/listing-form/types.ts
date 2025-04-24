
import { PropertyPurpose, PropertyType, ResidentialType, CommercialType, UserType } from "@/types";

export interface ListingFormValues {
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  subType: string;
  location: {
    city: string;
    locality: string;
    subLocality?: string;
    society?: string;
    address: string;
    pincode: string;
  };
  details: {
    bedrooms?: string;
    bathrooms?: string;
    balconies?: string;
    plotArea?: string;
    builtUpArea?: string;
    carpetArea?: string;
    furnishing: "furnished" | "semi-furnished" | "unfurnished";
    furnishingDetails?: Record<string, number | boolean>;
    totalFloors?: string;
    floorNumber?: string;
    age?: "0-1" | "1-5" | "5-10" | "10+" | "new-launch";
    facing?: "east" | "west" | "north" | "south" | "northeast" | "northwest" | "southeast" | "southwest";
    parking?: "covered" | "open" | "both" | "none";
    parkingSpots?: string;
  };
  price: string;
  securityDeposit?: string;
  priceInWords?: string;
  priceNegotiable?: boolean;
  additionalCharges?: {
    electricity?: boolean;
    water?: boolean;
    maintenance?: boolean;
  };
  agreementType?: "company" | "any";
  brokerAllowed?: boolean;
  description: string;
  availability?: string;
  tenantPreference?: "family" | "men" | "women" | "any";
  images?: string[];
  coverImageIndex?: number;
  video?: string;
  audioDescription?: string;
  amenities?: string[];
  agreementDuration?: string;
  noticePeriod?: string;
}

export interface StepProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
}

