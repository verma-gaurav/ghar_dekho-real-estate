
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

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
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
            <Link to="/buy" className="text-sm font-medium hover:text-estate-500 transition-colors">
              Buy
            </Link>
            <Link to="/rent" className="text-sm font-medium hover:text-estate-500 transition-colors">
              Rent
            </Link>
            <Link to="/pg" className="text-sm font-medium hover:text-estate-500 transition-colors">
              PG/Co-living
            </Link>
            <Link to="/commercial" className="text-sm font-medium hover:text-estate-500 transition-colors">
              Commercial
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="icon" className="hidden md:flex">
                <Link to="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="hidden md:flex">
                    <Plus className="h-4 w-4 mr-2" /> List Property
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>List Your Property</DialogTitle>
                    <DialogDescription>
                      You're just a few steps away from listing your property
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Start listing your property by choosing the purpose:
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <Button asChild variant="outline" className="h-auto flex flex-col py-6">
                        <Link to="/list-property/sell">
                          <Home className="h-8 w-8 mb-2" />
                          <span>Sell</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            List property for sale
                          </span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-auto flex flex-col py-6">
                        <Link to="/list-property/rent">
                          <Building className="h-8 w-8 mb-2" />
                          <span>Rent</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            List property for rent
                          </span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-auto flex flex-col py-6">
                        <Link to="/list-property/pg">
                          <User className="h-8 w-8 mb-2" />
                          <span>PG</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            List as paying guest
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      alt="User"
                      className="rounded-full h-8 w-8"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-properties" className="cursor-pointer">My Properties</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">Saved Properties</Link>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" /> Login / Register
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Account Access</DialogTitle>
                    <DialogDescription>
                      Login or create a new account to access all features
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="login" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="mt-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                          </div>
                          <Button type="submit" className="mt-2">
                            Login
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="mt-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="register-name">Full Name</Label>
                            <Input id="register-name" type="text" placeholder="John Doe" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="register-email">Email</Label>
                            <Input id="register-email" type="email" placeholder="name@example.com" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="register-phone">Phone Number</Label>
                            <Input id="register-phone" type="tel" placeholder="+1234567890" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="register-password">Password</Label>
                            <Input id="register-password" type="password" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="register-confirm-password">Confirm Password</Label>
                            <Input id="register-confirm-password" type="password" />
                          </div>
                          <Button type="submit" className="mt-2">
                            Register
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
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
                    <span className="font-bold text-lg">Propify</span>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Your real estate marketplace
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                  <Link 
                    to="/buy" 
                    className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buy
                  </Link>
                  <Link 
                    to="/rent" 
                    className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Rent
                  </Link>
                  <Link 
                    to="/pg" 
                    className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    PG/Co-living
                  </Link>
                  <Link 
                    to="/commercial" 
                    className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Commercial
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
                          to="/favorites" 
                          className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Saved Properties
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex items-center py-2 text-sm font-medium hover:text-estate-500 transition-colors w-full text-left">
                              <User className="h-4 w-4 mr-2" />
                              Login / Register
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Account Access</DialogTitle>
                              <DialogDescription>
                                Login or create a new account to access all features
                              </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="login" className="mt-4">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="login" className="mt-4">
                                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                  <div className="grid gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-email">Email</Label>
                                      <Input id="mobile-email" type="email" placeholder="name@example.com" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-password">Password</Label>
                                      <Input id="mobile-password" type="password" />
                                    </div>
                                    <Button type="submit" className="mt-2">
                                      Login
                                    </Button>
                                  </div>
                                </form>
                              </TabsContent>
                              
                              <TabsContent value="register" className="mt-4">
                                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                  <div className="grid gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-register-name">Full Name</Label>
                                      <Input id="mobile-register-name" type="text" placeholder="John Doe" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-register-email">Email</Label>
                                      <Input id="mobile-register-email" type="email" placeholder="name@example.com" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-register-phone">Phone Number</Label>
                                      <Input id="mobile-register-phone" type="tel" placeholder="+1234567890" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-register-password">Password</Label>
                                      <Input id="mobile-register-password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="mobile-register-confirm-password">Confirm Password</Label>
                                      <Input id="mobile-register-confirm-password" type="password" />
                                    </div>
                                    <Button type="submit" className="mt-2">
                                      Register
                                    </Button>
                                  </div>
                                </form>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
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
