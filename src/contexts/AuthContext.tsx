
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { createOrUpdateUser, getUserData } from "@/services/userService";
import { Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/sonner";
import { User } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        setSession(session);
        
        if (session?.user) {
          try {
            // Only update state synchronously here
            const basicUserData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
              phone: session.user.user_metadata?.phone || '',
              type: session.user.user_metadata?.type || 'owner',
            };
            
            // Do a minimal update first
            setUser(basicUserData as User);
            
            // Then use setTimeout to avoid blocking the auth state change
            setTimeout(async () => {
              try {
                // First try to get the complete user profile from our database
                const completeUserData = await getUserData(session.user.id);
                setUser(completeUserData);
              } catch (error) {
                console.log("User not found in database, creating profile...");
                // If user doesn't exist in our DB yet, create them
                try {
                  const newUser = await createOrUpdateUser({
                    id: basicUserData.id,
                    name: basicUserData.name || '',
                    email: basicUserData.email,
                    phone: basicUserData.phone || '',
                    type: basicUserData.type || 'owner',
                    savedProperties: [],
                    listedProperties: [],
                    inquiries: [],
                    savedSearches: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  console.log("User created in database:", newUser);
                  setUser(newUser);
                } catch (createError) {
                  console.error("Failed to create user in database:", createError);
                  toast("Error", {
                    description: "Failed to create your user profile. Please try again.",
                  });
                }
              }
            }, 0);
          } catch (error) {
            console.error("Error setting up user data:", error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setSession(session);
      
      if (session?.user) {
        const basicUserData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || '',
          type: session.user.user_metadata?.type || 'owner',
        };
        
        // Set basic user data immediately
        setUser(basicUserData as User);
        
        // Then fetch the complete profile
        setTimeout(async () => {
          try {
            const completeUserData = await getUserData(session.user.id);
            setUser(completeUserData);
          } catch (error) {
            console.log("User not found in database, creating profile...");
            try {
              const newUser = await createOrUpdateUser({
                id: basicUserData.id,
                name: basicUserData.name || '',
                email: basicUserData.email,
                phone: basicUserData.phone || '',
                type: basicUserData.type || 'owner',
                savedProperties: [],
                listedProperties: [],
                inquiries: [],
                savedSearches: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              console.log("User created in database:", newUser);
              setUser(newUser);
            } catch (createError) {
              console.error("Failed to create user in database:", createError);
            }
          }
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    setShowAuthModal(false);
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          name: name, // Add both to ensure consistency
          phone,
          type: 'owner', // Default type
        }
      }
    });
    
    if (error) throw error;
    
    // We'll handle user creation in the database through onAuthStateChange
    // to ensure we have the authenticated user's ID
    setShowAuthModal(false);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        register, 
        logout, 
        showAuthModal, 
        setShowAuthModal 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
