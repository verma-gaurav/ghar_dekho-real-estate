
import { Property, User } from "@/types";
import { mockProperties } from "@/data/mockData";

// Mock database service
class Database {
  private properties: Property[] = [];
  private users: User[] = [];
  
  constructor() {
    // Initialize with mock data
    this.properties = [...mockProperties];
    
    // Generate some mock users
    this.users = [
      {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        type: "owner",
        savedProperties: ["prop1", "prop2"],
        listedProperties: ["prop3", "prop4"],
        inquiries: [],
        savedSearches: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        type: "agent",
        savedProperties: ["prop5"],
        listedProperties: ["prop6", "prop7", "prop8"],
        inquiries: [],
        savedSearches: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
  
  // Property related methods
  getAllProperties(): Property[] {
    return this.properties;
  }
  
  getPropertyById(id: string): Property | undefined {
    return this.properties.find(property => property.id === id);
  }
  
  addProperty(property: Omit<Property, "id" | "createdAt" | "updatedAt" | "views" | "propertyScore">): Property {
    // Generate a new ID
    const id = `prop${this.properties.length + 1}`;
    
    // Calculate property score based on completeness
    let propertyScore = 0;
    
    // Basic details add 20% to score
    if (property.title && property.purpose && property.type) {
      propertyScore += 20;
    }
    
    // Location details add 20% to score
    if (property.location && property.location.city && property.location.locality) {
      propertyScore += 20;
    }
    
    // Property details add 20% to score
    if (property.details && property.details.furnishing) {
      propertyScore += 20;
    }
    
    // Images add 20% to score
    if (property.images && property.images.length > 0) {
      propertyScore += 20;
    }
    
    // Description adds 20% to score
    if (property.description && property.description.length > 50) {
      propertyScore += 20;
    }
    
    const newProperty: Property = {
      id,
      ...property,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      propertyScore,
      views: 0
    };
    
    this.properties.push(newProperty);
    
    // If posted by a user, update their listedProperties
    const userId = newProperty.postedBy.id;
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.listedProperties.push(id);
    }
    
    return newProperty;
  }
  
  updateProperty(id: string, updates: Partial<Property>): Property | undefined {
    const index = this.properties.findIndex(property => property.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    // Update the property
    this.properties[index] = {
      ...this.properties[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.properties[index];
  }
  
  deleteProperty(id: string): boolean {
    const initialLength = this.properties.length;
    this.properties = this.properties.filter(property => property.id !== id);
    
    // Also remove from user's listedProperties
    this.users.forEach(user => {
      user.listedProperties = user.listedProperties.filter(propId => propId !== id);
    });
    
    return this.properties.length < initialLength;
  }
  
  // Filtering methods
  filterProperties(filters: any): Property[] {
    let filtered = [...this.properties];
    
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
    
    return filtered;
  }
  
  // User related methods
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  addUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = `user${this.users.length + 1}`;
    
    const newUser: User = {
      id,
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  // Favorite/Saved properties
  toggleSavedProperty(userId: string, propertyId: string): boolean {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return false;
    }
    
    const index = user.savedProperties.indexOf(propertyId);
    
    if (index > -1) {
      // Remove if already saved
      user.savedProperties = user.savedProperties.filter(id => id !== propertyId);
      return false;
    } else {
      // Add if not saved
      user.savedProperties.push(propertyId);
      return true;
    }
  }
}

// Create a singleton instance
const database = new Database();

export default database;
