import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createOrUpdateUser } from "@/services/userService";
import { User } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Profile() {
  const { user, isAuthenticated, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>({});
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        savedProperties: user.savedProperties,
        listedProperties: user.listedProperties,
        inquiries: user.inquiries,
        savedSearches: user.savedSearches,
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setUserData((prev) => ({ ...prev, type: value as User["type"] }));
  };

  const handleSave = async () => {
    if (!userData.id || !userData.email || !userData.name || !userData.phone || !userData.type) {
      toast("Missing Information", {
        description: "Please fill in all required fields."
      });
      return;
    }

    setIsLoading(true);
    try {
      await createOrUpdateUser(userData);
      toast("Profile Updated", {
        description: "Your profile has been updated successfully."
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Update Failed", {
        description: "There was an error updating your profile. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Reset error
    setPasswordError("");
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      // Note: currentPassword is still required in the form for security,
      // but verification is handled differently on the server
      const result = await updatePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast("Password Updated", {
          description: "Your password has been successfully updated."
        });
        
        // Clear form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      setPasswordError(error.message || "An unexpected error occurred");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback className="text-2xl">
                      {userData.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{userData.name}</h3>
                    <p className="text-muted-foreground text-sm capitalize">{userData.type}</p>
                  </div>
                  
                  <div className="w-full mt-6">
                    <p className="text-sm text-muted-foreground mb-1">Member since</p>
                    <p className="font-medium">{new Date(userData.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Properties Listed</p>
                      <p className="font-medium">{userData.listedProperties?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Properties Saved</p>
                      <p className="font-medium">{userData.savedProperties?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Inquiries</p>
                      <p className="font-medium">{userData.inquiries?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {editMode ? "Edit your personal information below" : "Your personal information details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {editMode ? (
                          <Input 
                            id="name" 
                            name="name" 
                            value={userData.name || ''} 
                            onChange={handleInputChange} 
                            className="mt-1" 
                          />
                        ) : (
                          <p className="text-sm mt-1 py-2">{userData.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="type">User Type</Label>
                        {editMode ? (
                          <Select 
                            onValueChange={handleTypeChange} 
                            defaultValue={userData.type}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="builder">Builder</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-1 py-2 capitalize">{userData.type}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {editMode ? (
                        <Input 
                          id="email" 
                          name="email" 
                          value={userData.email || ''} 
                          onChange={handleInputChange} 
                          className="mt-1" 
                          disabled
                        />
                      ) : (
                        <p className="text-sm mt-1 py-2">{userData.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {editMode ? (
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={userData.phone || ''} 
                          onChange={handleInputChange} 
                          className="mt-1" 
                        />
                      ) : (
                        <p className="text-sm mt-1 py-2">{userData.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {editMode ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditMode(false)} 
                        className="mr-2"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {passwordError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        className="mt-1"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isPasswordLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        className="mt-1"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isPasswordLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        className="mt-1"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isPasswordLoading}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="destructive" disabled>Delete Account</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email Verification</p>
                      <p className="font-medium text-green-500">Verified</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Verification</p>
                      <p className="font-medium text-yellow-500">Pending</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Two-Factor Authentication</p>
                      <p className="font-medium text-yellow-500">Not Enabled</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Manage Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 