// User-related services for Supabase
import { supabase } from "@/integrations/supabase/client";
import { User, Property } from "@/types";
import type { Database } from "@/integrations/supabase/types";
import { fromDbProperty } from "./property/propertyDataService";

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
    created_at: undefined, // Let the database set these
    updated_at: undefined,
    email_verified: false,
    phone_verified: false,
    terms_accepted: false,
    terms_accepted_at: null,
  }
}

// Cache to prevent redundant calls for the same user ID within a short time period
const userCache = new Map<string, {user: User, timestamp: number}>();
const CACHE_EXPIRY_MS = 60000; // Cache expires after 1 minute

export const getUserData = async (userId: string): Promise<User> => {
  try {
    if (!userId) {
      console.log("No userId provided to getUserData");
      throw new Error("User ID is required");
    }
    
    // Check cache first
    const cachedData = userCache.get(userId);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS)) {
      return cachedData.user;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // If user not found or error, throw a specific error that can be caught and handled
    if (!data || error) {
      throw new Error("Not found");
    }
    
    const user = fromDbUser(data);
    
    // Store result in cache
    userCache.set(userId, {user, timestamp: Date.now()});
    
    return user;
  } catch (error) {
    // Don't log expected "Not found" errors to avoid console noise
    if (error instanceof Error && error.message !== "Not found") {
      console.error(`Error getting user with ID ${userId}:`, error);
    }
    throw error;
  }
};

// Saved Property feature is currently disabled
/*
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
    if (!userId) {
      console.log("No userId provided to getSavedProperties");
      return [];
    }
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('saved_properties')
      .eq('id', userId)
      .maybeSingle();

    // If user not found or error, return empty array instead of throwing
    if (!user || userError) {
      console.log("User not found or error in getSavedProperties, returning empty array");
      return [];
    }
    
    if (!user.saved_properties || user.saved_properties.length === 0) {
      return [];
    }
    
    // Then fetch actual properties
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .in('id', user.saved_properties);
    
    if (error) {
      console.error("Error fetching saved properties:", error);
      return [];
    }
    
    return (data ?? []).map(fromDbProperty);
  } catch (error) {
    console.error("Error getting saved properties:", error);
    // Return empty array instead of throwing
    return [];
  }
};
*/

// Create or update a user record
export const createOrUpdateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    // Make sure we have all required fields for a new user
    if (!userData.id || !userData.email || !userData.name || !userData.phone || !userData.type) {
      throw new Error("Missing required user data fields");
    }
    
    // First check if a user with this email already exists
    console.log(`Checking if user with email ${userData.email} already exists...`);
    const { data: existingUserByEmail, error: checkEmailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .maybeSingle();

    if (existingUserByEmail && !checkEmailError) {
      console.log(`User already exists with email ${userData.email}, updating instead of creating...`);
      // If a user with this email exists but with a different ID,
      // we need to handle this conflict appropriately
      
      if (existingUserByEmail.id !== userData.id) {
        console.log(`Warning: User with email ${userData.email} exists with different ID (${existingUserByEmail.id} vs ${userData.id})`);
        // Instead of trying to create a new user, return the existing one
        return fromDbUser(existingUserByEmail);
      }
    }
    
    console.log("Creating or updating user in database:", userData);
    const upsertInput = toDbUserInput(userData);
    
    // Try to handle the case where there might be a unique constraint on email
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(upsertInput as any)
        .select()
        .maybeSingle();
      
      if (error) {
        // Check if this is a duplicate key error on email
        if (error.code === '23505' && error.message?.includes('email')) {
          console.log("Duplicate email constraint detected, fetching existing user instead");
          // Get the existing user by email instead
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userData.email)
            .maybeSingle();
            
          if (existingUser && !fetchError) {
            // Update the cache with this user
            userCache.set(existingUser.id, {
              user: fromDbUser(existingUser),
              timestamp: Date.now()
            });
            return fromDbUser(existingUser);
          }
          throw error; // Still throw if we couldn't fetch the user
        }
        throw error;
      }
      
      if (!data) {
        throw new Error("User upsert failed - no data returned");
      }
      
      // Update cache with the newly created/updated user
      const user = fromDbUser(data);
      userCache.set(user.id, {user, timestamp: Date.now()});
      
      console.log("User created or updated successfully:", data);
      return user;
    } catch (upsertError) {
      // If upsert fails for any reason, try a simple select to see if the user exists
      console.error("Error during upsert, trying to fetch user by ID:", upsertError);
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.id)
        .maybeSingle();
      
      if (existingUser && !fetchError) {
        console.log("Found existing user by ID after upsert failure");
        // Update the cache with this user
        const user = fromDbUser(existingUser);
        userCache.set(user.id, {user, timestamp: Date.now()});
        return user;
      }
      
      throw upsertError;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};
