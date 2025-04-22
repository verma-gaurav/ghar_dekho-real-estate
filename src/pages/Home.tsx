
import { useState } from "react";
import { PropertyCard } from "@/components/ui/property-card";
import { SearchFilters } from "@/components/ui/search-filters";
import { mockProperties } from "@/data/mockData";
import { Property } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building, Home as HomeIcon, User, MapPin, ArrowRight, Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = (filters: any) => {
    // In a real application, this would be a server-side search
    // For demo purposes, we'll just filter the mock data
    let filtered = mockProperties;

    // Filter by purpose (buy/rent/pg)
    if (filters.purpose) {
      if (filters.purpose === "buy") {
        filtered = filtered.filter(p => p.purpose === "sell");
      } else {
        filtered = filtered.filter(p => p.purpose === filters.purpose);
      }
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.type === filters.propertyType);
      
      // Filter by sub-type
      if (filters.subType) {
        filtered = filtered.filter(p => p.subType === filters.subType);
      }
    }

    // Filter by bedrooms
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.details.bedrooms) return false;
        return filters.bedrooms.includes(p.details.bedrooms.toString());
      });
    }

    // Filter by bathrooms
    if (filters.bathrooms && filters.bathrooms.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.details.bathrooms) return false;
        return filters.bathrooms.includes(p.details.bathrooms.toString());
      });
    }

    // Filter by furnishing
    if (filters.furnishing && filters.furnishing.length > 0) {
      filtered = filtered.filter(p => {
        return filters.furnishing.includes(p.details.furnishing);
      });
    }

    // Filter by budget
    if (filters.budget && filters.budget.length === 2) {
      filtered = filtered.filter(p => {
        return p.price >= filters.budget[0] && p.price <= filters.budget[1];
      });
    }

    // Filter by area
    if (filters.area && filters.area.length === 2) {
      filtered = filtered.filter(p => {
        const area = p.details.carpetArea || p.details.builtUpArea || p.details.plotArea || 0;
        return area >= filters.area[0] && area <= filters.area[1];
      });
    }

    // Filter by posted by (owner/builder/agent)
    if (filters.postedBy && filters.postedBy.length > 0) {
      filtered = filtered.filter(p => {
        return filters.postedBy.includes(p.postedBy.type);
      });
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(p => {
        return filters.amenities.every((amenity: string) => p.amenities.includes(amenity));
      });
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => {
        return (
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.location.city.toLowerCase().includes(searchLower) ||
          p.location.locality.toLowerCase().includes(searchLower) ||
          (p.location.society && p.location.society.toLowerCase().includes(searchLower))
        );
      });
    }

    setFilteredProperties(filtered);
  };

  const filterByTab = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === "all") {
      setFilteredProperties(mockProperties);
      return;
    }
    
    if (tab === "buy") {
      setFilteredProperties(mockProperties.filter(p => p.purpose === "sell"));
      return;
    }
    
    setFilteredProperties(mockProperties.filter(p => p.purpose === tab));
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
              
              <Tabs defaultValue="buy" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="rent">Rent</TabsTrigger>
                  <TabsTrigger value="pg">PG</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter locality, landmark, city or project"
                        className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-estate-300"
                      />
                      <Button className="absolute right-1 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 mr-2" /> Search
                      </Button>
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
                      />
                      <Button className="absolute right-1 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 mr-2" /> Search
                      </Button>
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
                      />
                      <Button className="absolute right-1 top-1/2 -translate-y-1/2">
                        <Search className="h-4 w-4 mr-2" /> Search
                      </Button>
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
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <HomeIcon className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Buy a Home</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Rent a Home</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">PG/Co-living</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-8 flex flex-col items-center justify-center gap-3 hover:bg-estate-50 hover:border-estate-300 transition-all rounded-xl">
              <div className="w-16 h-16 bg-estate-100 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-estate-500" />
              </div>
              <span className="font-medium">Commercial</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
            <Tabs value={activeTab} onValueChange={filterByTab} className="hidden md:flex">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buy">For Sale</TabsTrigger>
                <TabsTrigger value="rent">For Rent</TabsTrigger>
                <TabsTrigger value="pg">PG</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden mb-6">
            <Tabs value={activeTab} onValueChange={filterByTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buy">Sale</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
                <TabsTrigger value="pg">PG</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="group">
              View All Properties 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
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

      {/* Search Properties Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Search Properties</h2>
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
    </div>
  );
}
