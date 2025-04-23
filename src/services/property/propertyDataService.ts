
import { Property } from "@/types";
import type { Database } from "@/integrations/supabase/types";

export function fromDbProperty(row: Database['public']['Tables']['properties']['Row']): Property {
  return {
    id: row.id,
    title: row.title,
    purpose: row.purpose as Property["purpose"],
    type: row.type as Property["type"],
    subType: (row.sub_type ?? "") as Property["subType"],
    price: Number(row.price),
    securityDeposit: row.security_deposit ? Number(row.security_deposit) : undefined,
    location: row.location as Property["location"],
    details: row.details as Property["details"],
    amenities: row.amenities ?? [],
    description: row.description,
    images: row.images ?? [],
    video: row.videos && row.videos.length > 0 ? row.videos[0] : undefined,
    availability: row.available_from ?? "",
    postedBy: row.posted_by as Property["postedBy"],
    termsAndConditions: row.features as Property["termsAndConditions"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    propertyScore: row.property_score,
    views: row.views,
    audioDescription: undefined
  };
}

export function toDbPropertyInput(p: Partial<Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "propertyScore">> & { id?: string, propertyScore?: number, views?: number }): Database['public']['Tables']['properties']['Insert'] {
  return {
    id: p.id,
    title: p.title!,
    purpose: p.purpose!,
    type: p.type!,
    sub_type: p.subType,
    price: p.price!,
    security_deposit: p.securityDeposit,
    location: p.location!,
    details: p.details!,
    amenities: p.amenities ?? [],
    description: p.description!,
    images: p.images ?? [],
    videos: [],
    available_from: p.availability,
    posted_by: p.postedBy!,
    features: p.termsAndConditions as any,
    created_at: undefined,
    updated_at: undefined,
    property_score: p.propertyScore,
    views: p.views
  }
}

