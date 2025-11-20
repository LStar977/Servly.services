import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { mockProviders, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Search() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('c') || urlParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter providers logic
  const filteredProviders = useMemo(() => {
    return mockProviders.filter(provider => {
      // Filter by category
      if (selectedCategory !== 'all') {
         const category = categories.find(c => c.slug === selectedCategory);
         if (category && !provider.categories.includes(category.id)) {
           return false;
         }
      }
      
      // Filter by search term (name or description)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          provider.businessName.toLowerCase().includes(term) || 
          provider.description.toLowerCase().includes(term) ||
          provider.city.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }, [searchTerm, selectedCategory]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
         <h3 className="font-semibold mb-4">Categories</h3>
         <div className="space-y-2">
           <div 
             className={`cursor-pointer text-sm p-2 rounded-md hover:bg-muted transition-colors ${selectedCategory === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
             onClick={() => { setSelectedCategory('all'); setIsFilterOpen(false); }}
           >
             All Categories
           </div>
           {categories.map(cat => (
             <div 
               key={cat.id} 
               className={`cursor-pointer text-sm p-2 rounded-md hover:bg-muted transition-colors ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}
               onClick={() => { setSelectedCategory(cat.slug); setIsFilterOpen(false); }}
             >
               {cat.name}
             </div>
           ))}
         </div>
      </div>
      
      {/* Additional filters placeholder */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
           <Button variant="outline" size="sm">Any</Button>
           <Button variant="outline" size="sm">$$</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      {/* Search Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Find a Professional</h1>
        
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl shadow-sm border sticky top-20 z-30">
          <div className="flex-1 relative">
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search..." 
               className="pl-9"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          {/* Desktop Category Select */}
          <div className="hidden md:block w-[200px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Button (Sheet Trigger) */}
          <div className="md:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  {selectedCategory !== 'all' && <Badge className="ml-2 h-5 px-1.5" variant="secondary">1</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-20">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Button (Placeholder) */}
          <Button variant="outline" className="hidden md:flex">
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <FilterContent />
        </div>

        {/* Provider List */}
        <div className="lg:col-span-3 space-y-6">
          <p className="text-sm text-muted-foreground">{filteredProviders.length} providers found</p>
          
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
              <p className="text-lg font-medium">No providers found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredProviders.map(provider => {
              const providerCategories = categories.filter(c => provider.categories.includes(c.id));
              
              return (
                <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 md:h-auto bg-muted relative">
                       {provider.imageUrl ? (
                         <img src={provider.imageUrl} alt={provider.businessName} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                           {provider.businessName.charAt(0)}
                         </div>
                       )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <h2 className="text-xl font-bold hover:text-primary transition-colors">{provider.businessName}</h2>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                               <MapPin className="h-3 w-3" /> {provider.city}
                             </div>
                           </div>
                           <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md border border-yellow-100">
                             <Star className="h-3.5 w-3.5 fill-current" />
                             <span className="font-bold text-sm">{provider.rating}</span>
                             <span className="text-xs opacity-70">({provider.reviewCount})</span>
                           </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{provider.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {providerCategories.map(cat => (
                            <Badge key={cat.id} variant="secondary" className="font-normal">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Popular Services:</p>
                          {provider.services.slice(0, 2).map(service => (
                            <div key={service.id} className="flex justify-between text-sm bg-muted/30 p-2 rounded">
                              <span>{service.title}</span>
                              <span className="font-medium">${service.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end pt-4 border-t">
                         <Link href={`/booking?providerId=${provider.id}`} className="w-full md:w-auto">
                           <Button className="w-full">Request Booking</Button>
                         </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
