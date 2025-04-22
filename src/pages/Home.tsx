
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { PropertyCard } from "@/components/ui/property-card";
import { SearchFilters } from "@/components/ui/search-filters";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { Property } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, Home as HomeIcon, User, MapPin, ArrowRight, Check, Search, Filter, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import database from "@/services/database";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "buy" | "rent" | "pg" | "commercial">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Determine the active tab based on the current route
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    if (path === "buy") setActiveTab("buy");
    else if (path === "rent") setActiveTab("rent");
    else if (path === "pg") setActiveTab("pg");
    else if (path === "commercial") setActiveTab("commercial");
    else setActiveTab("all");
  }, [location]);

  // Initial load of properties
  useEffect(() => {
    const allProperties = database.getAllProperties();
    setFilteredProperties(allProperties);
    
    // Filter properties based on current tab
    filterByTab(activeTab);
  }, [activeTab]);

  const handleSearch = (filters: any) => {
    const filtered = database.filterProperties(filters);
    setFilteredProperties(filtered);
  };

  const handleAdvancedFilters = (filters: any) => {
    const filtered = database.filterProperties(filters);
    setFilteredProperties(filtered);
    setAdvancedFiltersOpen(false);
  };

  const filterByTab = (tab: string) => {
    setActiveTab(tab as any);
    
    // Update URL to match the selected tab
    if (tab !== "all") {
      navigate(`/${tab}`);
    } else {
      navigate("/");
    }
    
    // Filter properties based on tab
    const allProperties = database.getAllProperties();
    
    if (tab === "all") {
      setFilteredProperties(allProperties);
      return;
    }
    
    if (tab === "buy") {
      setFilteredProperties(allProperties.filter(p => p.purpose === "sell"));
      return;
    }
    
    setFilteredProperties(allProperties.filter(p => p.purpose === tab));
  };

  const handleBasicSearch = () => {
    if (!searchQuery.trim()) return;
    
    const filters = {
      searchTerm: searchQuery,
      purpose: activeTab === "buy" ? "sell" : activeTab === "all" ? undefined : activeTab
    };
    
    const filtered = database.filterProperties(filters);
    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-estate-100 to-white z-0 opacity-50"></div>
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-estate-800 mb-4">
                Find Your Perfect Property
              </h1>
              <p className="text-lg text-estate-600 mb-8">
                Explore thousands of properties for sale and rent across the country
              </p>
              
              <Tabs 
                defaultValue={activeTab === "all" ? "buy" : activeTab} 
                value={activeTab === "all" ? "buy" : activeTab}
                onValueChange={(value) => filterByTab(value)}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="rent">Rent</TabsTrigger>
                  <TabsTrigger value="pg">PG</TabsTrigger>
                  <TabsTrigger value="commercial">Commercial</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter locality, landmark, city or project"
                        className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-estate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBasicSearch()}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-1">
                              <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Advanced Filters</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto pr-2">
                              <AdvancedFilters purpose="buy" onApplyFilters={handleAdvancedFilters} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={handleBasicSearch}>
                          <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="rent" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter locality, landmark, city or project"
                        className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-estate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBasicSearch()}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-1">
                              <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Advanced Filters</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto pr-2">
                              <AdvancedFilters purpose="rent" onApplyFilters={handleAdvancedFilters} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={handleBasicSearch}>
                          <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="pg" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter locality, landmark, city or project"
                        className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-estate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBasicSearch()}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-1">
                              <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Advanced Filters</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto pr-2">
                              <AdvancedFilters purpose="pg" onApplyFilters={handleAdvancedFilters} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={handleBasicSearch}>
                          <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="commercial" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter locality, landmark, city or project"
                        className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-estate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBasicSearch()}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                        <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-1">
                              <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Advanced Filters</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto pr-2">
                              <AdvancedFilters purpose="commercial" onApplyFilters={handleAdvancedFilters} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button onClick={handleBasicSearch}>
                          <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxury home"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-estate-300 text-white px-2 py-1">Top Rated</Badge>
                    <Badge className="bg-white text-estate-700 px-2 py-1 border border-estate-200">5000+ Properties</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            What are you looking for?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Button 
              variant="outline" 
              className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl"
              onClick={() => filterByTab("buy")}
            >
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <HomeIcon className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Buy a Home</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl"
              onClick={() => filterByTab("rent")}
            >
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Rent a Home</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl"
              onClick={() => filterByTab("pg")}
            >
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">PG/Co-living</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl"
              onClick={() => filterByTab("commercial")}
            >
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Commercial</span>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Post Property CTA */}
      <section className="py-10 bg-estate-100">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">List Your Property Today</h2>
              <p className="text-muted-foreground">Reach thousands of potential buyers and tenants for free</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/list-property">Post Property <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              {activeTab === "all" 
                ? "Featured Properties" 
                : activeTab === "buy" 
                  ? "Properties for Sale" 
                  : activeTab === "rent" 
                    ? "Properties for Rent" 
                    : activeTab === "pg" 
                      ? "PG Accommodations" 
                      : "Commercial Properties"}
            </h2>
            <div className="hidden md:flex items-center">
              <Button variant="outline" asChild className="mr-2">
                <Link to="/list-property">Post Property</Link>
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setAdvancedFiltersOpen(true)}>
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search filters to find more properties.</p>
              <Button onClick={() => {
                setSearchQuery("");
                filterByTab(activeTab);
              }}>
                Reset Filters
              </Button>
            </div>
          )}
          
          {filteredProperties.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="group" onClick={() => setShowAdvancedFilters(true)}>
                View All Properties 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Propify</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to providing the best real estate experience with unique benefits and features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-estate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-estate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                All our properties are thoroughly verified to ensure accuracy and reliability.
              </p>
            </div>
            
            <div className="bg-estate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-estate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Brokerage</h3>
              <p className="text-muted-foreground">
                Connect directly with owners and builders without paying any brokerage fee.
              </p>
            </div>
            
            <div className="bg-estate-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-estate-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-estate-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Tours</h3>
              <p className="text-muted-foreground">
                Explore properties from the comfort of your home with our virtual tour feature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Properties with Advanced Search */}
      {showAdvancedFilters && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Search Properties</h2>
                <Button variant="outline" onClick={() => setAdvancedFiltersOpen(true)}>
                  <Filter className="h-4 w-4 mr-2" /> Advanced Filters
                </Button>
              </div>
              
              <SearchFilters onSearch={handleSearch} />
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  {filteredProperties.length} Properties Found
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Email Alerts Section */}
      <section className="py-12 bg-estate-100">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-8 w-8 text-estate-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Property Alerts</h2>
            <p className="text-muted-foreground mb-8">
              Stay updated with new properties matching your criteria. We'll send notifications straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 py-2 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-estate-300"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
