import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Star, ShieldCheck, Clock, HeartHandshake } from "lucide-react";
import { categories } from "@/lib/data";
import heroImage from "@assets/stock_images/happy_family_in_a_cl_5a620258.jpg";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/search');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50 backdrop-blur-sm text-secondary-foreground">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Over 5,000 trusted providers
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Services, <br/>
                <span className="text-primary">simplified.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Find and book trusted local professionals for everything from home cleaning to plumbing repairs. No phone tag, just results.
              </p>
              
              <form onSubmit={handleSearch} className="bg-white dark:bg-card p-2 rounded-2xl shadow-xl border border-border/50 max-w-md flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="What do you need help with?" 
                    className="pl-9 border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
                  />
                </div>
                <div className="w-px bg-border hidden sm:block my-2"></div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Zip code" 
                    className="pl-9 border-0 shadow-none focus-visible:ring-0 h-12 bg-transparent"
                  />
                </div>
                <Button size="lg" className="h-12 px-6 rounded-xl text-base">
                  Search
                </Button>
              </form>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-primary" /> Verified Pros</span>
                <span className="flex items-center"><HeartHandshake className="w-4 h-4 mr-1.5 text-primary" /> Satisfaction Guarantee</span>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] transform rotate-3"></div>
              <img 
                src={heroImage} 
                alt="Happy family in clean home" 
                className="relative w-full h-full object-cover rounded-[3rem] shadow-2xl"
              />
              
              {/* Floating Card 1 */}
              <div className="absolute top-12 -left-6 bg-card p-4 rounded-xl shadow-lg border animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Background Checked</p>
                    <p className="text-xs text-muted-foreground">100% of our pros</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute bottom-20 -right-6 bg-card p-4 rounded-xl shadow-lg border animate-bounce duration-[4000ms]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gray-200" />
                    ))}
                  </div>
                  <div>
                    <div className="flex text-yellow-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <p className="text-xs font-medium mt-0.5">4.9/5 Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-950/20"></div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Expert help for every project</h2>
            <p className="text-muted-foreground text-lg">From quick fixes to major renovations, find the right professional for the job.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?category=${category.slug}`}>
                <div className="group cursor-pointer flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors text-primary">
                     {/* Dynamic Icon Rendering would go here, using placeholder for now since we have strings */}
                     <div className="font-bold text-2xl">{category.name.charAt(0)}</div>
                  </div>
                  <span className="font-medium text-center group-hover:text-primary transition-colors">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Easy Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse profiles, read reviews, and book your service in just a few clicks. No more endless phone tag.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Trusted Pros</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every provider on Servly is vetted and background-checked, so you can invite them into your home with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Transparent Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                See prices upfront or get detailed quotes before the work begins. No hidden fees or surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">Ready to simplify your life?</h2>
              <p className="text-blue-100 text-lg md:text-xl">Join thousands of happy customers who have found their go-to professionals on Servly.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-xl">Get Started</Button>
                </Link>
                <Link href="/auth/signup?role=provider">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                    Join as a Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
