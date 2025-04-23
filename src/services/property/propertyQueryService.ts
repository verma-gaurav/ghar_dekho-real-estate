
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { fromDbProperty } from "./propertyDataService";

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

