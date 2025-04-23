
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { fromDbProperty, toDbPropertyInput } from "./propertyDataService";

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

