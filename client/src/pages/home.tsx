import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, Star, ShieldCheck, Clock, HeartHandshake, Check, ArrowRightCircle } from "lucide-react";
import { categories } from "@/lib/data";
import heroImage from "@assets/stock_images/happy_family_in_a_cl_5a620258.jpg";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/search');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Beta Banner */}
      <div className="bg-primary/10 text-primary text-center py-2 text-sm font-medium">
        Beta • Launching in 2026
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            
            <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
              Find and book <br className="hidden md:block" />
              <span className="text-primary">trusted local services.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Servly makes it effortless for people to discover and book verified local service providers and gives small businesses the tools to operate with the polish of a large company. One place for booking, scheduling, and staying organized.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/search">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  Find a service
                </Button>
              </Link>
              <Link href="/auth/signup?role=provider">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                  I'm a business
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4">
              Web first • Mobile app coming after launch
            </p>
          </div>
        </div>
      </section>

      {/* Split Value Prop Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background">
                For individuals
              </div>
              <h2 className="text-3xl font-bold">Services, simplified.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover and book verified providers for cleaning, repairs, moving, beauty, automotive services, and more — without the frustration of messaging, phoning, waiting, or coordinating.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Verified Professionals</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Upfront Pricing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Secure Booking</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background">
                For businesses
              </div>
              <h2 className="text-3xl font-bold">Run like a modern brand.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Run your business like a modern brand — with bookings, schedules, and customers all in one place.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Manage Schedule</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Accept Payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  <span>Customer CRM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Mock */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick booking</h2>
            <p className="text-muted-foreground">Try how Servly will feel for customers.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-xl border p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-4">
                <label className="text-sm font-medium mb-2 block">What do you need?</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <Badge key={cat.id} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input type="date" />
              </div>
              <div className="md:col-span-1">
                 <label className="text-sm font-medium mb-2 block">Time</label>
                 <Input type="time" />
              </div>
              <div className="md:col-span-2">
                 <label className="text-sm font-medium mb-2 block">Location</label>
                 <Input placeholder="Enter your zip code" />
              </div>
              
              <div className="md:col-span-4 pt-4">
                <Link href="/search">
                  <Button className="w-full h-12 text-lg">See available providers</Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  No messy DMs or lost notes — just clear bookings that both you and the business can track.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Servly works</h2>
            <p className="text-muted-foreground text-lg">One simple flow for people booking services, and a clean dashboard for the businesses that deliver them.</p>
          </div>

          {/* For Individuals Steps */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
               <Badge variant="outline" className="text-base px-4 py-1">For individuals</Badge>
               <p className="text-muted-foreground">Servly helps you quickly find trusted local pros for any job.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Pick a service</h3>
                <p className="text-muted-foreground">Choose what you need — cleaning, repairs, moving, beauty, auto and more.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Compare providers</h3>
                <p className="text-muted-foreground">Browse local businesses, see what they offer, and pick the one that fits you best.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Book & relax</h3>
                <p className="text-muted-foreground">Choose a time, confirm your request, and let them handle the rest.</p>
              </div>
            </div>
          </div>
          
          {/* For Business Steps */}
          <div>
            <div className="flex items-center gap-4 mb-8">
               <Badge variant="outline" className="text-base px-4 py-1">For service businesses</Badge>
               <p className="text-muted-foreground">Servly helps small service businesses get discovered and run smoother.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Join Servly</h3>
                <p className="text-muted-foreground">Create a profile and list the services you already offer.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get booked</h3>
                <p className="text-muted-foreground">Customers find you, send requests, and you choose which ones to accept.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-4xl font-bold text-muted/50 mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Grow like a big brand</h3>
                <p className="text-muted-foreground">Get a modern booking system and cleaner operations without hiring a tech team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Services you can run through Servly</h2>
            <p className="text-muted-foreground text-lg">Any local service that lives in texts, DMs, or a messy calendar right now can run through Servly instead.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?category=${category.slug}`}>
                <div className="group cursor-pointer p-6 rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full bg-card">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">Find trusted {category.name.toLowerCase()} professionals near you.</p>
                  <div className="flex items-center text-sm font-medium text-primary">
                    Explore {category.name.toLowerCase()} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/search">
                <div className="group cursor-pointer p-6 rounded-2xl border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full bg-muted/50">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">More Services</h3>
                  <p className="text-muted-foreground mb-4">Other local services, pet care, tutoring, and errands.</p>
                  <div className="flex items-center text-sm font-medium text-primary">
                    Explore more services <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Be part of Servly's launch.</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join the waitlist to be the first to try Servly when we go live. Whether you're looking for services or running a business, we'll keep you in the loop as we launch in new areas.
          </p>
          
          <form className="bg-background p-6 rounded-2xl shadow-2xl max-w-md mx-auto text-left space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email address</label>
              <Input placeholder="you@example.com" className="bg-white text-foreground" />
              <p className="text-xs text-muted-foreground mt-1">We'll only use this to send you updates about Servly.</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">I'm most interested in:</label>
              <div className="space-y-2">
                 <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                   <input type="radio" name="interest" id="customer" className="accent-primary" defaultChecked />
                   <label htmlFor="customer" className="text-sm text-foreground cursor-pointer flex-1">Booking services as a customer</label>
                 </div>
                 <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                   <input type="radio" name="interest" id="provider" className="accent-primary" />
                   <label htmlFor="provider" className="text-sm text-foreground cursor-pointer flex-1">Listing my business as a provider</label>
                 </div>
              </div>
            </div>
            
            <Button size="lg" className="w-full text-lg">Join the waitlist</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
