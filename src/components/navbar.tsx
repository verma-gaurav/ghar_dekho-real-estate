import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, Heart, Home, Menu, Plus, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSafeImageUrl } from "@/utils/imageUtils";

export function Navbar() {
  const { isAuthenticated, user, logout, setShowAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-estate-400" />
            <span className="text-xl font-bold text-estate-700">Propify</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4 ml-6">
            <Link to="/about" className="text-sm font-medium hover:text-estate-500 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-estate-500 transition-colors">
              Contact Us
            </Link>
            <Link to="/faq" className="text-sm font-medium hover:text-estate-500 transition-colors">
              FAQ
            </Link>
            <Link to="/terms" className="text-sm font-medium hover:text-estate-500 transition-colors">
              Terms
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild className="hidden md:flex">
                <Link to="/list-property">
                  <Plus className="h-4 w-4 mr-2" /> List Property
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {user?.profilePicture ? (
                      <img
                        src={getSafeImageUrl(user.profilePicture)}
                        alt={user.name}
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <div className="bg-estate-200 rounded-full h-8 w-8 flex items-center justify-center text-estate-700 font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                 
                  <DropdownMenuItem asChild>
                    <Link to="/my-properties" className="cursor-pointer">My Properties</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="hidden md:flex"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="h-4 w-4 mr-2" /> Login / Register
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-estate-400" />
                    <span className="text-lg font-bold text-estate-700">Propify</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              
              <div className="grid gap-6 mt-6">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4 mb-4">
                    {user?.profilePicture ? (
                      <img
                        src={getSafeImageUrl(user.profilePicture)}
                        alt={user.name}
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <div className="bg-estate-200 rounded-full h-8 w-8 flex items-center justify-center text-estate-700 font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" /> Login / Register
                  </Button>
                )}
                
                <nav className="grid gap-2">
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-estate-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                  <Link 
                    to="/contact" 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-estate-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4" />
                    <span>Contact Us</span>
                  </Link>
                  <Link 
                    to="/faq" 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-estate-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>FAQ</span>
                  </Link>
                  <Link 
                    to="/terms" 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-estate-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4" />
                    <span>Terms</span>
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      <div className="border-t my-2 pt-2">
                        <Link 
                          to="/list-property" 
                          className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          List Property
                        </Link>
                        <Link 
                          to="/dashboard" 
                          className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                        <button 
                          onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                          className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors w-full text-left"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-t my-2 pt-2">
                        <button
                          className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors w-full text-left"
                          onClick={() => {
                            setShowAuthModal(true);
                            setIsMenuOpen(false);
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Login / Register
                        </button>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
