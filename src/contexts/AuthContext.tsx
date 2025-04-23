
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { createOrUpdateUser } from "@/services/userService";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  type?: string;
}

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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            phone: session.user.user_metadata?.phone,
          };
          setUser(userData);
          
          // Create or update user in our custom users table
          if (event === 'SIGNED_IN') {
            try {
              await createOrUpdateUser({
                id: userData.id,
                name: userData.name || '',
                email: userData.email,
                phone: userData.phone || '',
                type: 'owner',
                savedProperties: [],
                listedProperties: [],
                inquiries: [],
                savedSearches: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            } catch (error) {
              console.error("Error creating/updating user:", error);
            }
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          phone: session.user.user_metadata?.phone,
        });
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
          phone,
        }
      }
    });
    
    if (error) throw error;

    // The user entry in our database will be created by the onAuthStateChange listener
    // when the SIGNED_IN event is triggered after successful registration
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
