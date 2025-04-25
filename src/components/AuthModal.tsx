import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast("Please fill in all fields", {
        description: "Email and password are required",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(loginEmail, loginPassword);
      setShowEmailConfirmation(false);
      toast("Login successful", {
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast("Login failed", {
        description: error.message || "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      toast("Missing fields", {
        description: "Please fill in all fields",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Show initial toast that we're creating the account
      toast("Creating your account...", {
        description: "This may take a moment",
      });
      
      // Wait for the registration process to complete, including database creation
      const result = await register(registerEmail, registerPassword, registerName, registerPhone);
      
      if (result.success) {
        // Only show success message after database creation is confirmed
        toast("Registration successful", {
          description: "Please check your email for a confirmation link.",
        });
        
        // Switch to login tab and show email confirmation message
        setActiveTab("login");
        setShowEmailConfirmation(true);
        setRegisteredEmail(registerEmail);
        
        // Prefill login email with the registered email
        setLoginEmail(registerEmail);
        
        // Reset form fields
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPhone("");
        setRegisterPassword("");
      } else {
        // Check if it's a duplicate email error
        if (result.message?.includes("already registered")) {
          toast("Email already in use", {
            description: result.message,
          });
          
          // Focus back on the email field so user can correct it
          const emailField = document.getElementById("register-email");
          if (emailField) {
            emailField.focus();
          }
        } else {
          // Show general error message
          toast("Registration incomplete", {
            description: result.message || "Please try again or contact support",
          });
        }
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast("Registration failed", {
        description: error.message || "There was an error creating your account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={(open) => {
      // Only allow closing the modal if not currently loading
      if (!isLoading) {
        setShowAuthModal(open);
        if (!open) {
          // Reset state when closing the modal
          setShowEmailConfirmation(false);
          setActiveTab("login");
        }
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Access</DialogTitle>
          <DialogDescription>
            Login or create a new account to access all features
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            {showEmailConfirmation && (
              <Alert className="mb-4 bg-blue-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please check <strong>{registeredEmail}</strong> for a confirmation link before logging in.
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input 
                    id="register-name" 
                    type="text" 
                    placeholder="John Doe"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <Input 
                    id="register-phone" 
                    type="tel" 
                    placeholder="+1234567890"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
