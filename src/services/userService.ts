// User-related services for Supabase
import { supabase } from "@/integrations/supabase/client";
import { User, Property } from "@/types";
import type { Database } from "@/integrations/supabase/types";
import { fromDbProperty } from "@/services/propertyService";

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
    savedSearches: (user.saved_searches && Array.isArray(user.saved_searches))
      ? user.saved_searches.map(s => typeof s === "string" ? s : JSON.stringify(s))
      : [],
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
