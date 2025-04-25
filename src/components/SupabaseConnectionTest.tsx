import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "success" | "error"
  >("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function checkConnection() {
      try {
        // Query a table that exists in our database
        const { data, error } = await supabase.from("properties").select("*").limit(1);
        
        if (error) {
          throw error;
        }
        
        setConnectionStatus("success");
      } catch (error) {
        setConnectionStatus("error");
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-medium">Supabase Connection Status</h2>
      {connectionStatus === "checking" && (
        <p className="text-yellow-500">Checking connection...</p>
      )}
      {connectionStatus === "success" && (
        <p className="text-green-500">Connected to Supabase successfully!</p>
      )}
      {connectionStatus === "error" && (
        <div>
          <p className="text-red-500">Failed to connect to Supabase</p>
          <p className="text-sm mt-2">{errorMessage}</p>
        </div>
      )}
    </div>
  );
} 