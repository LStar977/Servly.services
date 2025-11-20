import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star, ShieldCheck, Sparkles, Trees, Car, Dog, Snowflake, Wrench, Zap, Truck, Search, Calendar, CheckCircle, Award, Lock, ThumbsUp, Bot, MapPin, Heart } from "lucide-react";
import { categories, mockProviders } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [, setLocation] = useLocation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="h-8 w-8" />;
      case 'Trees': return <Trees className="h-8 w-8" />;
      case 'Car': return <Car className="h-8 w-8" />;
      case 'Dog': return <Dog className="h-8 w-8" />;
      case 'Snowflake': return <Snowflake className="h-8 w-8" />;
      case 'Wrench': return <Wrench className="h-8 w-8" />;
      case 'Zap': return <Zap className="h-8 w-8" />;
      case 'Truck': return <Truck className="h-8 w-8" />;
      default: return <Sparkles className="h-8 w-8" />;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/search');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background dark:from-indigo-500/10 dark:via-background dark:to-background -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                  Your world of services, <span className="text-primary">simplified.</span>
                </h1>
                <h2 className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed font-light">
                  Book trusted service pros instantly — and manage everything in one app. From cleaning to car detailing, Servly handles it all for you.
                </h2>
              </div>

              {/* Big Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-lg">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input 
                    className="h-14 pl-12 pr-4 text-lg rounded-xl shadow-sm border-2 border-input hover:border-primary/50 transition-colors" 
                    placeholder="What service do you need today?" 
                  />
                </div>
                <div className="absolute right-2 top-2">
                  <Button size="sm" className="h-10 px-6 rounded-lg">Search</Button>
                </div>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Find Services Near You
                  </Button>
                </Link>
                <Link href="/auth/signup?role=provider">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl bg-background border-2 hover:bg-muted">
                    Join as a Provider
                  </Button>
                </Link>
              </div>

               {/* For Business Teaser */}
               <Link href="/for-business">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer group">
                   <span className="text-sm font-medium text-primary">Run a service business? Grow with Servly Pro</span>
                   <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                 </div>
               </Link>
            </div>
            
            <div className="relative lg:h-[500px] h-[300px] animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
              <Carousel 
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-border/50"
              >
                <CarouselContent className="h-full ml-0">
                  {categories.map((category) => (
                    <CarouselItem key={category.id} className="pl-0 h-full">
                      <div className="relative w-full h-full group">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                           <div className="flex items-end justify-between">
                             <div>
                               <p className="text-white font-heading font-bold text-3xl mb-2">{category.name}</p>
                               <p className="text-white/80 text-lg">Book instant {category.name} services</p>
                             </div>
                           </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars Section (Replaces Stats) */}
      <section className="border-y bg-muted/20 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div className="flex flex-col items-center gap-3">
               <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-lg">Verified Pros</div>
                 <div className="text-sm text-muted-foreground">Rigorous background checks</div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-3">
               <div className="bg-green-100 text-green-600 p-3 rounded-full">
                 <Lock className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-lg">Secure & Safe</div>
                 <div className="text-sm text-muted-foreground">Protected payments & data</div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-3">
               <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                 <Star className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-lg">Quality First</div>
                 <div className="text-sm text-muted-foreground">Top-rated service standards</div>
               </div>
             </div>
             <div className="flex flex-col items-center gap-3">
               <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                 <Heart className="w-6 h-6" />
               </div>
               <div>
                 <div className="font-bold text-lg">Community</div>
                 <div className="text-sm text-muted-foreground">Supporting local businesses</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works Strip */}
      <section className="py-16">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-2xl font-bold">How Servly Works</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4 relative">
                 <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Search className="w-8 h-8" />
                 </div>
                 <div className="absolute top-8 left-[60%] w-full h-0.5 bg-border -z-10 hidden md:block"></div>
                 <h3 className="font-bold text-lg">1. Choose a service</h3>
                 <p className="text-muted-foreground text-sm">Find exactly what you need help with.</p>
              </div>
              <div className="text-center space-y-4 relative">
                 <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Calendar className="w-8 h-8" />
                 </div>
                 <div className="absolute top-8 left-[60%] w-full h-0.5 bg-border -z-10 hidden md:block"></div>
                 <h3 className="font-bold text-lg">2. Pick a time</h3>
                 <p className="text-muted-foreground text-sm">Select a slot that works for you.</p>
              </div>
              <div className="text-center space-y-4">
                 <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Zap className="w-8 h-8" />
                 </div>
                 <h3 className="font-bold text-lg">3. Match instantly</h3>
                 <p className="text-muted-foreground text-sm">We connect you with a top-rated pro.</p>
              </div>
           </div>
        </div>
      </section>

      {/* AI Features - Servly Assist */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium border border-white/20">
                       <Bot className="w-4 h-4" /> Servly Assist
                    </div>
                    <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-2 py-1 rounded-md uppercase tracking-wider">Coming Soon</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Meet your personal service concierge.</h2>
                  <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                     Ask anything and we'll book it for you. "Find me a car detailing at 3 PM today." Servly Assist handles the search, booking, and payment.
                  </p>
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90">Try Servly Assist</Button>
               </div>
               <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                  <div className="space-y-4">
                     <div className="bg-white/10 rounded-xl p-4 rounded-tl-none max-w-[85%]">
                        <p className="text-sm">I need a plumber for a leaky faucet tomorrow morning.</p>
                     </div>
                     <div className="bg-primary rounded-xl p-4 rounded-tr-none max-w-[85%] ml-auto">
                        <p className="text-sm">I found 3 top-rated plumbers available tomorrow between 8am-11am. Dave's Plumbing ($150/hr) has a 4.9 rating. Shall I book him?</p>
                     </div>
                     <div className="bg-white/10 rounded-xl p-4 rounded-tl-none max-w-[85%]">
                        <p className="text-sm">Yes, please book for 9am.</p>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-green-400 font-medium mt-2">
                        <CheckCircle className="w-4 h-4" /> Booking Confirmed
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Featured Providers */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-12">
              <div>
                 <h2 className="text-3xl font-bold mb-2">Top-Rated Pros</h2>
                 <p className="text-muted-foreground">Meet some of the best local experts on Servly.</p>
              </div>
              <Link href="/search">
                 <Button variant="ghost" className="gap-2">View All <ArrowRight className="w-4 h-4" /></Button>
              </Link>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              {mockProviders.slice(0, 3).map((provider) => (
                 <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    <div className="h-48 bg-muted relative">
                       <img src={provider.imageUrl} alt={provider.businessName} className="w-full h-full object-cover" />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-sm font-bold shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {provider.rating}
                       </div>
                    </div>
                    <CardContent className="p-6">
                       <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{provider.businessName}</h3>
                       <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3.5 h-3.5" /> {provider.city}
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{provider.description}</p>
                       <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">Background Checked</span>
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium">verified</span>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
         {/* Subtle tech grid pattern */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">All Service Categories</h2>
            <p className="text-muted-foreground text-lg">Whatever you need, we've got a pro for that.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?category=${category.slug}`}>
                <div className="group cursor-pointer flex flex-col items-center gap-6 p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="h-20 w-20 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors text-primary">
                     {getIcon(category.icon)}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-2">{category.name}</h3>
                    <div className="flex items-center justify-center text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Book Now <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Benefits */}
      <section className="py-24 bg-background">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
               {[
                  { icon: Zap, title: "Instant Booking", desc: "No waiting for quotes. Book instantly." },
                  { icon: ShieldCheck, title: "Verified Providers", desc: "Every pro is background checked." },
                  { icon: Award, title: "Satisfaction Guarantee", desc: "Not happy? We'll make it right." },
                  { icon: Lock, title: "Secure Payments", desc: "Your money is safe until the job is done." },
               ].map((benefit, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm">
                     <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                     <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Service Areas */}
      <section className="py-12 bg-muted/50 border-t">
         <div className="container mx-auto px-4 text-center">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-center gap-2">
               <MapPin className="w-5 h-5 text-primary" /> Proudly Serving
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-muted-foreground">
               {["Toronto", "Calgary", "Vancouver", "Chicago", "Los Angeles", "New York", "Miami", "Austin"].map((city) => (
                  <span key={city} className="hover:text-primary cursor-pointer transition-colors">{city}</span>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
