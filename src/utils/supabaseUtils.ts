import { supabase } from "@/integrations/supabase/client";

/**
 * Tests the connection to Supabase and logs the results to the console
 */
export async function testSupabaseConnection(): Promise<boolean> {
  console.log("Testing Supabase connection...");
  
  try {
    // Query a table that exists in our database
    const { data, error } = await supabase.from("properties").select("*").limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log("✅ Supabase connection successful");
    console.log("Database response:", data);
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed");
    console.error("Error details:", error);
    return false;
  }
}

/**
 * Checks if data exists in the 'users' table
 */
export async function checkUsersTable(): Promise<void> {
  console.log("Checking users table...");
  
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) throw error;
    
    console.log(`✅ Users table accessible. Contains ${count} records.`);
    if (data && data.length > 0) {
      console.log("Sample user record:", data[0]);
    }
  } catch (error) {
    console.error("❌ Error accessing users table:", error);
  }
} 