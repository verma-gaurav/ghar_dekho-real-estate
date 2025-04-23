import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import type { Database } from "@/integrations/supabase/types";

// Export the helper function
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
    audioDescription: undefined // Not present in schema
  };
}

// Helper: Convert app Property type to DB row object for insert/update
function toDbPropertyInput(p: Partial<Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "propertyScore">> & { id?: string, propertyScore?: number, views?: number }): Database['public']['Tables']['properties']['Insert'] {
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

export const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "propertyScore">) => {
  const id = uuidv4();
  let propertyScore = 0;
  if (propertyData.title && propertyData.purpose && propertyData.type) propertyScore += 20;
  if (propertyData.location && propertyData.location.city && propertyData.location.locality) propertyScore += 20;
  if (propertyData.details && propertyData.details.furnishing) propertyScore += 20;
  if (propertyData.images && propertyData.images.length > 0) propertyScore += 20;
  if (propertyData.description && propertyData.description.length > 50) propertyScore += 20;
  const now = new Date().toISOString();

  const newProperty: Property = {
    id,
    ...propertyData,
    createdAt: now,
    updatedAt: now,
    propertyScore,
    views: 0
  };

  const propertyInsert: Database['public']['Tables']['properties']['Insert'] = {
    ...toDbPropertyInput({
      ...propertyData,
      id,
      propertyScore,
      views: 0
    }),
    created_at: now,
    updated_at: now
  };

  try {
    const { error } = await supabase.from('properties').insert([propertyInsert] as any);
    if (error) throw error;

    // Update the user's listedProperties if applicable
    if (propertyData.postedBy?.id) {
      const { data: userDataRaw, error: userError } = await supabase
        .from('users')
        .select('listed_properties')
        .eq('id', propertyData.postedBy.id)
        .maybeSingle();

      if (userError) throw userError;
      const listedProperties = userDataRaw?.listed_properties ?? [];
      const updateRes = await supabase
        .from('users')
        .update({
          listed_properties: [...listedProperties, id]
        } as any)
        .eq('id', propertyData.postedBy.id);
      if (updateRes.error) throw updateRes.error;
    }

    return newProperty;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    if (error) throw error;
    return (data ?? []).map(fromDbProperty);
  } catch (error) {
    console.error("Error getting all properties:", error);
    throw error;
  }
};

export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (!data || error) throw error || new Error("Not found");
    return fromDbProperty(data);
  } catch (error) {
    console.error(`Error getting property with ID ${id}:`, error);
    throw error;
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    const now = new Date().toISOString();
    
    // Create DB update object, but omit keys that should not be in the update
    const dbUpdates = {
      ...toDbPropertyInput(updates),
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('properties')
      .update(dbUpdates as any)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (!data || error) throw error || new Error("Property not found after update");
    return fromDbProperty(data);
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

export const filterProperties = async (filters: any): Promise<Property[]> => {
  try {
    let query = supabase.from('properties').select('*');
    if (filters.purpose) {
      if (filters.purpose === 'buy') {
        query = query.eq('purpose', 'sell');
      } else {
        query = query.eq('purpose', filters.purpose);
      }
    }
    if (filters.propertyType) {
      query = query.eq('type', filters.propertyType);
      if (filters.subType) {
        query = query.eq('sub_type', filters.subType);
      }
    }
    if (filters.searchTerm) {
      // Simple OR search for title, description, location.city
      const term = filters.searchTerm.replace(/[%_]/g, '\\$&');
      query = query.or([
        `title.ilike.%${term}%`,
        `description.ilike.%${term}%`,
        `location->>city.ilike.%${term}%`
      ].join(","));
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(fromDbProperty);
  } catch (error) {
    console.error("Error filtering properties:", error);
    throw error;
  }
};
