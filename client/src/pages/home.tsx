import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Sparkles, Trees, Car, Dog, Snowflake, Wrench, Zap, Truck } from "lucide-react";
import { categories } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                  Your world of services, <span className="text-primary">simplified.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
                  Book trusted local professionals in minutes — from cleaning to car detailing.
                </p>
              </div>
              
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
              
              <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground pt-4">
                 <div className="flex items-center gap-2">
                   <div className="bg-green-100 text-green-600 rounded-full p-1">
                     <ShieldCheck className="w-4 h-4" />
                   </div>
                   Verified Pros
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="bg-yellow-100 text-yellow-600 rounded-full p-1">
                     <Star className="w-4 h-4" />
                   </div>
                   4.9/5 Average Rating
                 </div>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[3rem] transform rotate-3"></div>
              
              <Carousel 
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full h-full rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800"
              >
                <CarouselContent className="h-full ml-0">
                  {categories.map((category) => (
                    <CarouselItem key={category.id} className="pl-0 h-full">
                      <div className="relative w-full h-full group">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-10">
                           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 inline-block">
                             <p className="text-white font-heading font-bold text-2xl mb-2">{category.name}</p>
                             <p className="text-white/80 text-sm">Book instant {category.name} services</p>
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
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20"></div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What do you need done?</h2>
            <p className="text-muted-foreground text-lg">Explore our most popular service categories.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?category=${category.slug}`}>
                <div className="group cursor-pointer flex flex-col items-center gap-6 p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
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
    </div>
  );
}
