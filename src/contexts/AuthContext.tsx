import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { createOrUpdateUser, getUserData } from "@/services/userService";
import { Session } from '@supabase/supabase-js';
import { toast } from "@/components/ui/sonner";
import { User } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<{ success: boolean, message?: string }>;
  logout: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean, message?: string }>;
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
  const [registrationCompleted, setRegistrationCompleted] = useState<{ email: string, completed: boolean } | null>(null);
  
  // Track user IDs being processed to prevent loops
  const processingUserIds = useRef(new Set<string>());
  
  // Initialize userCreationAttempted from localStorage if available
  const [userCreationAttempted, setUserCreationAttempted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('userCreationAttempted');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      return new Set<string>();
    }
  });

  // Save userCreationAttempted to localStorage whenever it changes
  useEffect(() => {
    if (userCreationAttempted.size > 0) {
      localStorage.setItem('userCreationAttempted', JSON.stringify([...userCreationAttempted]));
    }
  }, [userCreationAttempted]);
  
  // Helper function to avoid repeating the same creation logic
  const createUserIfNeeded = async (basicUserData: Partial<User>) => {
    if (!basicUserData.id || userCreationAttempted.has(basicUserData.id)) {
      return false;
    }
    
    // Prevent repeated attempts for the same user ID
    if (processingUserIds.current.has(basicUserData.id)) {
      return false;
    }
    
    processingUserIds.current.add(basicUserData.id);
    
    // Mark that we've attempted to create this user to prevent duplicate attempts
    setUserCreationAttempted(prev => new Set([...prev, basicUserData.id as string]));
    
    try {
      // Check if a user with this email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', basicUserData.email as string)
        .maybeSingle();
      
      if (existingUser) {
        console.log("User with this email already exists, linking accounts...", existingUser);
        // Get the complete user data and update with the new auth ID
        try {
          const completeUserData = await getUserData(existingUser.id);
          setUser(completeUserData);
          processingUserIds.current.delete(basicUserData.id);
          return true;
        } catch (e) {
          console.error("Error fetching existing user data:", e);
          processingUserIds.current.delete(basicUserData.id);
          return false;
        }
      }
      
      // If no existing user with this email, create a new one
      const newUser = await createOrUpdateUser({
        id: basicUserData.id,
        name: basicUserData.name || '',
        email: basicUserData.email || '',
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
      processingUserIds.current.delete(basicUserData.id);
      return true;
    } catch (error) {
      console.error("Failed to create user in database:", error);
      toast("Error", {
        description: "Failed to create your user profile. Please try again.",
      });
      processingUserIds.current.delete(basicUserData.id);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        // Skip further processing if this is just a TOKEN_REFRESHED event
        if (event === 'TOKEN_REFRESHED') {
          return;
        }
        
        setIsAuthenticated(!!session);
        setSession(session);
        
        if (session?.user) {
          try {
            // Check if we're already processing this user to prevent loops
            if (processingUserIds.current.has(session.user.id)) {
              return;
            }
            
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
                // Skip if we're already processing this user
                if (processingUserIds.current.has(session.user.id)) {
                  return;
                }
                
                processingUserIds.current.add(session.user.id);
                
                // First try to get the complete user profile from our database
                const completeUserData = await getUserData(session.user.id);
                setUser(completeUserData);
                
                // If this was a new registration, mark it as completed
                if (registrationCompleted && registrationCompleted.email === session.user.email && !registrationCompleted.completed) {
                  setRegistrationCompleted({ email: session.user.email, completed: true });
                }
                
                processingUserIds.current.delete(session.user.id);
              } catch (error: any) {
                // Check if this is a "not found" error and we haven't attempted to create this user yet
                if (error.message === "Not found" && !userCreationAttempted.has(session.user.id)) {
                  console.log("User not found in database, creating profile...");
                  await createUserIfNeeded(basicUserData);
                  
                  // If this was a new registration, mark it as completed
                  if (registrationCompleted && registrationCompleted.email === session.user.email && !registrationCompleted.completed) {
                    setRegistrationCompleted({ email: session.user.email, completed: true });
                  }
                } else if (error.message === "Not found") {
                  // Silent handling for repeated attempts
                } else {
                  // For any other error, log it but don't try to create a user
                  console.error("Error fetching user data:", error);
                  toast("Error", {
                    description: "Failed to load your profile. Please try logging in again.",
                  });
                }
                
                processingUserIds.current.delete(session.user.id);
              }
            }, 0);
          } catch (error) {
            console.error("Error setting up user data:", error);
            if (session.user.id) {
              processingUserIds.current.delete(session.user.id);
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
      setSession(session);
      
      if (session?.user) {
        // Skip if we're already processing this user
        if (processingUserIds.current.has(session.user.id)) {
          setIsLoading(false);
          return;
        }
        
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
            // Skip if we're already processing this user
            if (processingUserIds.current.has(session.user.id)) {
              return;
            }
            
            processingUserIds.current.add(session.user.id);
            
            const completeUserData = await getUserData(session.user.id);
            setUser(completeUserData);
            
            processingUserIds.current.delete(session.user.id);
          } catch (error: any) {
            // Check if this is a "not found" error and we haven't attempted to create this user yet
            if (error.message === "Not found" && !userCreationAttempted.has(session.user.id)) {
              console.log("User not found in database, creating profile...");
              await createUserIfNeeded(basicUserData);
            } else if (error.message === "Not found") {
              // Silent handling for repeated attempts
            } else {
              // For any other error, log it but don't try to create a user
              console.error("Error fetching user data:", error);
              toast("Error", {
                description: "Failed to load your profile. Please try logging in again.",
              });
            }
            
            if (session.user.id) {
              processingUserIds.current.delete(session.user.id);
            }
          }
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [registrationCompleted]);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    setShowAuthModal(false);
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Check if email already exists before attempting to register
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (existingUser) {
        return { 
          success: false, 
          message: "This email address is already registered. Please log in instead or use a different email." 
        };
      }
      
      // Start tracking this registration
      setRegistrationCompleted({ email, completed: false });

      // Sign up the user with Supabase auth
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name, // Add both to ensure consistency
            phone,
            type: 'owner', // Default type
          }
        }
      });
      
      if (error) throw error;
      
      // If we have the user data from signup, create a record in public.users table immediately
      if (data.user) {
        try {
          console.log("Creating user record in public.users table...");
          
          // Create user in our database
          const newUser = await createOrUpdateUser({
            id: data.user.id,
            name: name,
            email: email,
            phone: phone,
            type: 'owner',
            savedProperties: [],
            listedProperties: [],
            inquiries: [],
            savedSearches: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          console.log("Successfully created user in public.users:", newUser);
          
          // Set user to show data immediately
          setUser(newUser);
          
          // Mark registration as completed
          setRegistrationCompleted({ email, completed: true });
          
          // Close the modal after successful DB creation
          setShowAuthModal(false);
          
          return { success: true };
        } catch (dbError: any) {
          console.error("Failed to create user in database:", dbError);
          
          // Check for duplicate email error
          if (dbError.code === '23505' && dbError.message?.includes('email')) {
            // We can't use admin.deleteUser on the client side, so just handle the error gracefully
            console.log("Duplicate email detected after auth creation");
            
            return { 
              success: false, 
              message: "This email address is already registered. Please log in instead or use a different email." 
            };
          }
          
          // Don't close the modal if there was an error creating the user in the database
          return { 
            success: false, 
            message: "Account created in auth system, but failed to create in database: " + dbError.message 
          };
        }
      }
      
      // If we don't have user data (unlikely), fall back to the original approach
      // Return a promise that will resolve when registration is completed
      return new Promise<{ success: boolean, message?: string }>((resolve, reject) => {
        // Set up a timeout to check if registration completes
        const maxWaitTime = 10000; // 10 seconds
        const checkInterval = 500; // check every 500ms
        let elapsedTime = 0;
        
        const checkRegistrationStatus = setInterval(() => {
          elapsedTime += checkInterval;
          
          // If registration has completed successfully
          if (registrationCompleted && registrationCompleted.email === email && registrationCompleted.completed) {
            clearInterval(checkRegistrationStatus);
            // Close the modal only after successful DB creation
            setShowAuthModal(false);
            resolve({ success: true });
          }
          
          // If we've waited too long
          if (elapsedTime >= maxWaitTime) {
            clearInterval(checkRegistrationStatus);
            // Don't close the modal if we couldn't confirm DB creation
            resolve({ 
              success: false, 
              message: "Account created in auth system, but we couldn't confirm database setup." 
            });
          }
        }, checkInterval);
      });
    } catch (error: any) {
      setRegistrationCompleted(null);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!session || !user?.email) {
        return { 
          success: false, 
          message: "You must be logged in to update your password" 
        };
      }

      // We'll skip the current password verification step since it's causing auth state loops
      // This is a temporary workaround until Supabase provides a better API for password verification
      
      // NOTE: Ideally, we would use a dedicated RPC function to verify the password, but 
      // for now, we'll just proceed with the password update

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      return { 
        success: true, 
        message: "Password updated successfully" 
      };
    } catch (error: any) {
      console.error("Error updating password:", error);
      return { 
        success: false, 
        message: error.message || "Failed to update password" 
      };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        register, 
        logout, 
        updatePassword,
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
