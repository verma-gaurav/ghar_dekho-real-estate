import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { fromDbProperty } from "./propertyDataService";

// Helper to prevent infinite retries 
let retryCount = 0;
const MAX_RETRIES = 3;

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    // Reset retry count on new initial attempt
    retryCount = 0;
    console.log("Starting to fetch all properties");
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) {
      console.error("Supabase error when fetching properties:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} properties`);
    return (data ?? []).map(fromDbProperty);
  } catch (error) {
    console.error("Error getting all properties:", error);
    
    // Enhanced error reporting
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", typeof error);
    }
    
    // If there's an auth error, prevent infinite retries
    if ((error as any)?.message === 'No API key found in request') {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Authentication error - retry attempt ${retryCount}/${MAX_RETRIES}`);
        // Wait a moment before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getAllProperties(); // Controlled retry
      } else {
        console.error("Max retries reached for authentication error");
      }
    }
    
    throw new Error(`Failed to fetch properties: ${error instanceof Error ? error.message : 'Network error'}`);
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

export const getUserProperties = async (userId: string): Promise<Property[]> => {
  try {
    console.log(`Fetching properties for user ID: ${userId}`);
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('posted_by->>id', userId);
    
    if (error) {
      console.error(`Supabase query error for getUserProperties: ${error.message}`);
      throw error;
    }

    console.log(`Found ${data?.length || 0} properties for user ID: ${userId}`);
    
    // Extra safety check to ensure only properties with matching posted_by.id are returned
    const filteredProperties = (data || []).filter(prop => {
      try {
        const postedBy = prop.posted_by as any;
        return postedBy && postedBy.id === userId;
      } catch (e) {
        console.error(`Error processing property ${prop.id}: Invalid posted_by data`, e);
        return false;
      }
    });
    
    console.log(`After additional filtering: ${filteredProperties.length} properties remain`);
    
    return filteredProperties.map(fromDbProperty);
  } catch (error) {
    console.error(`Error getting properties for user ${userId}:`, error);
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

