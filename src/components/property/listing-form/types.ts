
import { PropertyPurpose, PropertyType, ResidentialType, CommercialType, UserType, PropertyAge, FurnishingStatus, PropertyFacing, ParkingType } from "@/types";

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
    furnishing: FurnishingStatus;
    furnishingDetails?: Record<string, number | boolean>;
    totalFloors?: string;
    floorNumber?: string;
    age?: PropertyAge;
    facing?: PropertyFacing;
    parking?: ParkingType;
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
