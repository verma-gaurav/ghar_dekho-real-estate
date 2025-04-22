
import { supabase } from "@/integrations/supabase/client";
import { Property, User } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Property services
export const addProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "propertyScore">) => {
  // Generate a unique ID
  const id = uuidv4();
  
  // Calculate property score (similar to the mock database logic)
  let propertyScore = 0;
  
  // Basic details add 20% to score
  if (propertyData.title && propertyData.purpose && propertyData.type) {
    propertyScore += 20;
  }
  
  // Location details add 20% to score
  if (propertyData.location && propertyData.location.city && propertyData.location.locality) {
    propertyScore += 20;
  }
  
  // Property details add 20% to score
  if (propertyData.details && propertyData.details.furnishing) {
    propertyScore += 20;
  }
  
  // Images add 20% to score
  if (propertyData.images && propertyData.images.length > 0) {
    propertyScore += 20;
  }
  
  // Description adds 20% to score
  if (propertyData.description && propertyData.description.length > 50) {
    propertyScore += 20;
  }
  
  const now = new Date().toISOString();
  const newProperty: Property = {
    id,
    ...propertyData,
    createdAt: now,
    updatedAt: now,
    propertyScore,
    views: 0
  };
  
  try {
    const { error } = await supabase
      .from('properties')
      .insert(newProperty);
      
    if (error) throw error;
      
    // Update the user's listedProperties if applicable
    if (propertyData.postedBy?.id) {
      // First get current user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('listedProperties')
        .eq('id', propertyData.postedBy.id)
        .single();
        
      if (userError && userError.code !== 'PGRST116') throw userError;
      
      const listedProperties = userData?.listedProperties || [];
      
      // Then update with the new property ID
      await supabase
        .from('users')
        .update({
          listedProperties: [...listedProperties, id]
        })
        .eq('id', propertyData.postedBy.id);
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
    return data || [];
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
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting property with ID ${id}:`, error);
    throw error;
  }
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

export const filterProperties = async (filters: any): Promise<Property[]> => {
  try {
    let query = supabase.from('properties').select('*');
    
    // Filter by purpose (buy/rent/pg)
    if (filters.purpose) {
      if (filters.purpose === 'buy') {
        query = query.eq('purpose', 'sell');
      } else {
        query = query.eq('purpose', filters.purpose);
      }
    }
    
    // Filter by property type
    if (filters.propertyType) {
      query = query.eq('type', filters.propertyType);
      
      // Filter by sub-type
      if (filters.subType) {
        query = query.eq('subType', filters.subType);
      }
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,location->city.ilike.%${filters.searchTerm}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
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
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting user with ID ${userId}:`, error);
    throw error;
  }
};

export const toggleSavedProperty = async (userId: string, propertyId: string): Promise<boolean> => {
  try {
    // First, check if property is already saved by this user
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('savedProperties')
      .eq('id', userId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const savedProperties = user?.savedProperties || [];
    const isAlreadySaved = savedProperties.includes(propertyId);
    
    // Update user's savedProperties array based on current state
    if (isAlreadySaved) {
      // Remove property if already saved
      const { error: updateError } = await supabase
        .from('users')
        .update({
          savedProperties: savedProperties.filter(id => id !== propertyId)
        })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      return false;
    } else {
      // Add property if not saved
      const { error: updateError } = await supabase
        .from('users')
        .update({
          savedProperties: [...savedProperties, propertyId]
        })
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
    // First get the user's saved property IDs
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('savedProperties')
      .eq('id', userId)
      .single();
      
    if (userError) throw userError;
    
    if (!user?.savedProperties || user.savedProperties.length === 0) {
      return [];
    }
    
    // Then fetch the actual properties
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .in('id', user.savedProperties);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting saved properties:", error);
    throw error;
  }
};

// Create or update a user record
export const createOrUpdateUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};
