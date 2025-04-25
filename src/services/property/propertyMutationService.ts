import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { fromDbProperty, toDbPropertyInput } from "./propertyDataService";
import type { Database } from "@/integrations/supabase/types";

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
    views: 0,
    verification_status: false
  };

  const propertyInsert: Database['public']['Tables']['properties']['Insert'] = {
    ...toDbPropertyInput({
      ...propertyData,
      id,
      propertyScore,
      views: 0,
      verification_status: false
    }),
    created_at: now,
    updated_at: now
  };

  try {
    const { error } = await supabase.from('properties').insert([propertyInsert] as any);
    if (error) throw error;

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

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  try {
    const now = new Date().toISOString();
    
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

export const updatePropertyStatus = async (propertyId: string, status: string): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('properties')
      .update({
        purpose: status,
        updated_at: now
      })
      .eq('id', propertyId);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating status for property ${propertyId}:`, error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    // First get the property to find the owner
    const { data: propertyData, error: getError } = await supabase
      .from('properties')
      .select('posted_by')
      .eq('id', propertyId)
      .maybeSingle();
      
    if (getError) throw getError;
    
    if (propertyData && propertyData.posted_by) {
      const postedBy = propertyData.posted_by as Property['postedBy'];
      const userId = postedBy.id;
      
      // Get user's listed properties
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('listed_properties')
        .eq('id', userId)
        .maybeSingle();
        
      if (!userError && userData && userData.listed_properties) {
        // Remove property ID from listed_properties
        const updatedListedProperties = userData.listed_properties.filter(
          (id: string) => id !== propertyId
        );
        
        // Update user record
        await supabase
          .from('users')
          .update({ 
            listed_properties: updatedListedProperties 
          } as any)
          .eq('id', userId);
      }
    }
    
    // Delete the property
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting property ${propertyId}:`, error);
    throw error;
  }
};

export const updatePropertyVerification = async (propertyId: string, isVerified: boolean): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('properties')
      .update({
        verification_status: isVerified,
        updated_at: now
      })
      .eq('id', propertyId);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating verification status for property ${propertyId}:`, error);
    throw error;
  }
};
