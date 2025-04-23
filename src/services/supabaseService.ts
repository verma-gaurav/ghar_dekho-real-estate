// Services for property and user interactions with Supabase
import { supabase } from "@/integrations/supabase/client";
import { Property, User } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import type { Database } from "@/integrations/supabase/types";

// Helper: Convert DB property row to app Property type
function fromDbProperty(row: Database['public']['Tables']['properties']['Row']): Property {
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
    // Remove references to createdAt and updatedAt since they don't exist on the input type
    created_at: undefined,
    updated_at: undefined, 
    property_score: p.propertyScore,
    views: p.views
  }
}

// Helper: Map DB user row to User type
function fromDbUser(user: Database['public']['Tables']['users']['Row']): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    type: user.type as User["type"],
    profilePicture: user.avatar_url || undefined,
    savedProperties: user.saved_properties ? user.saved_properties.map(id => id.toString()) : [],
    listedProperties: user.listed_properties ? user.listed_properties.map(id => id.toString()) : [],
    inquiries: user.inquiries ? user.inquiries.map(id => id.toString()) : [],
    savedSearches: user.saved_searches ? [] : [], // Handling JSON to string array conversion
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }
}

function toDbUserInput(user: Partial<User>): Database['public']['Tables']['users']['Insert'] {
  return {
    id: user.id!,
    name: user.name!,
    email: user.email!,
    phone: user.phone!,
    type: user.type!,
    avatar_url: user.profilePicture ?? null,
    saved_properties: user.savedProperties as any[] ?? [],
    listed_properties: user.listedProperties as any[] ?? [],
    inquiries: user.inquiries as any[] ?? [],
    saved_searches: user.savedSearches as any[] ?? [],
    created_at: undefined,
    updated_at: undefined,
    email_verified: false,
    phone_verified: false,
    terms_accepted: false,
    terms_accepted_at: null,
  }
}

// Property services
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

// User related services
export const getUserData = async (userId: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (!data || error) throw error || new Error("Not found");
    return fromDbUser(data);
  } catch (error) {
    console.error(`Error getting user with ID ${userId}:`, error);
    throw error;
  }
};

export const toggleSavedProperty = async (userId: string, propertyId: string): Promise<boolean> => {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('saved_properties')
      .eq('id', userId)
      .maybeSingle();
    if (!user || fetchError) throw fetchError || new Error("User not found");

    const savedProperties = user.saved_properties ?? [];
    const isAlreadySaved = savedProperties.includes(propertyId);

    if (isAlreadySaved) {
      // Remove property
      const { error: updateError } = await supabase
        .from('users')
        .update({
          saved_properties: savedProperties.filter(id => id !== propertyId)
        } as any)
        .eq('id', userId);
      if (updateError) throw updateError;
      return false;
    } else {
      // Add property
      const { error: updateError } = await supabase
        .from('users')
        .update({
          saved_properties: [...savedProperties, propertyId]
        } as any)
        .eq('id', userId);
      if (updateError) throw updateError;
      return true;
    }
  } catch (error) {
    console.error("Error toggling saved property:", error);
    throw error;
  }
};

export const getSavedProperties = async (userId: string): Promise<Property[]> => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('saved_properties')
      .eq('id', userId)
      .maybeSingle();

    if (!user || userError) throw userError || new Error("User not found");
    if (!user.saved_properties || user.saved_properties.length === 0) {
      return [];
    }
    // Then fetch actual properties
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .in('id', user.saved_properties);
    if (error) throw error;
    return (data ?? []).map(fromDbProperty);
  } catch (error) {
    console.error("Error getting saved properties:", error);
    throw error;
  }
};

// Create or update a user record
export const createOrUpdateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    // Make sure we have all required fields for a new user
    if (!userData.id || !userData.email || !userData.name || !userData.phone || !userData.type) {
      throw new Error("Missing required user data fields");
    }
    
    const upsertInput = toDbUserInput(userData);
    const { data, error } = await supabase
      .from('users')
      .upsert(upsertInput as any)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error("Database error during user creation:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("User upsert failed - no data returned");
    }
    
    return fromDbUser(data);
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};
