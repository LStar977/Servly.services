import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search as SearchIcon, DollarSign, Loader2, SlidersHorizontal, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SERVICE_CATEGORIES = [
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'landscaping', name: 'Landscaping' },
  { id: 'moving', name: 'Moving' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'snow_removal', name: 'Snow Removal' },
  { id: 'pet_services', name: 'Pet Services' },
];

const CITIES = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
  'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton', 'Surrey', 'Burnaby',
  'Kingston', 'Waterloo', 'London', 'Windsor', 'Kitchener', 'Victoria'
];

interface Service {
  id: string;
  title: string;
  description?: string;
  price: string;
  priceUnit: string;
  categoryId: string;
  categoryName?: string;
  provider: {
    id: string;
    userId: string;
    businessName: string;
    description?: string;
    phone: string;
    city: string;
    rating: string;
    reviewCount: number;
    imageUrl?: string;
  };
}

export default function ServiceSearch() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  // Get city suggestions based on input
  const citySuggestions = useMemo(() => {
    if (!cityInput) return [];
    return CITIES.filter(city => 
      city.toLowerCase().startsWith(cityInput.toLowerCase())
    ).slice(0, 5);
  }, [cityInput]);

  const loadServices = async (filters: { search?: string; category?: string; city?: string; minPrice?: number; maxPrice?: number } = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.city) params.append("city", filters.city);
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

      const response = await fetch(`/api/services/search?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = {
      search: searchTerm,
      category: selectedCategory,
      city: selectedCity,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    loadServices(filters);
  };

  const handleLoadAll = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setCityInput("");
    setMinPrice("");
    setMaxPrice("");
    loadServices({});
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setCityInput("");
    setMinPrice("");
    setMaxPrice("");
    loadServices({});
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCityInput(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Search Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find a Service Professional</h1>
          <p className="text-lg opacity-90">Browse trusted service providers in your area</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Toggle Button (Mobile) */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
            data-testid="toggle-filters-button"
          >
            {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters Card */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service or Provider</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                      data-testid="input-search"
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City Autocomplete */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <div className="relative">
                    <Input
                      placeholder="e.g., Toronto"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      data-testid="input-city"
                    />
                    {citySuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 z-10 shadow-lg">
                        {citySuggestions.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleSelectCity(city)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            data-testid={`city-suggestion-${city}`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Min Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    data-testid="input-min-price"
                  />
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Price</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    data-testid="input-max-price"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 flex-wrap">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
                  data-testid="button-search"
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset} 
                  className="flex-1 md:flex-none"
                  data-testid="button-reset-filters"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load All Button */}
        <div className="mb-6 flex justify-center">
          <Button 
            onClick={handleLoadAll}
            variant="secondary"
            size="lg"
            data-testid="button-load-all"
            className="px-8"
          >
            Load All Services
          </Button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No services found matching your criteria</p>
              <Button variant="outline" onClick={handleLoadAll} data-testid="button-load-all-fallback">
                Load All Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{service.provider.businessName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {service.categoryName && <Badge variant="secondary">{service.categoryName}</Badge>}
                    {service.provider.rating && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        {service.provider.rating}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.description && (
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {service.provider.city}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-bold">${service.price}</span>
                      <span className="text-sm text-muted-foreground">/{service.priceUnit}</span>
                    </div>
                    <Link href={`/booking?serviceId=${service.id}`}>
                      <Button size="sm" data-testid={`button-book-${service.id}`}>Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
