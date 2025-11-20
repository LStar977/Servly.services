import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Search, Calendar, CheckCircle, CreditCard, Star, UserPlus, Settings, Bell, TrendingUp, Shield } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">How Servly Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking for help or looking for work, we make it simple.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 mb-4">
              For Customers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get it done in 5 easy steps</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-border hidden md:block -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-0">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2">1. Choose a Service</h3>
                  <p className="text-muted-foreground">Browse our categories or search for exactly what you need help with.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-background order-1 md:order-2">1</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-muted/30 p-6 rounded-2xl border w-fit">
                     <Search className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                <div className="flex-1 order-3 md:order-1 md:text-right flex justify-end">
                   <div className="bg-muted/30 p-6 rounded-2xl border w-fit">
                     <Calendar className="w-8 h-8 text-primary" />
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-background order-1 md:order-2">2</div>
                <div className="flex-1 order-2 md:order-3">
                  <h3 className="text-2xl font-bold mb-2">2. Pick a Time</h3>
                  <p className="text-muted-foreground">Select a date and time that works for your schedule.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2">3. Get Matched Instantly</h3>
                  <p className="text-muted-foreground">We'll show you available top-rated professionals in your area.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-background order-1 md:order-2">3</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-muted/30 p-6 rounded-2xl border w-fit">
                     <CheckCircle className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                <div className="flex-1 order-3 md:order-1 md:text-right flex justify-end">
                   <div className="bg-muted/30 p-6 rounded-2xl border w-fit">
                     <CreditCard className="w-8 h-8 text-primary" />
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-background order-1 md:order-2">4</div>
                <div className="flex-1 order-2 md:order-3">
                  <h3 className="text-2xl font-bold mb-2">4. Pay Securely</h3>
                  <p className="text-muted-foreground">Handle payments safely through our app. No cash needed.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2">5. Service Completed</h3>
                  <p className="text-muted-foreground">Relax while the job gets done, then leave a review.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-background order-1 md:order-2">5</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-muted/30 p-6 rounded-2xl border w-fit">
                     <Star className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/search">
              <Button size="lg" className="px-8 h-12 text-lg rounded-xl">Find Services Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video Placeholder */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-8">See Servly in Action</h2>
           <div className="max-w-4xl mx-auto aspect-video bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
             <div className="text-center">
               <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
               </div>
               <p className="font-medium">Watch 60s Demo</p>
             </div>
           </div>
        </div>
      </section>

      {/* For Providers */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-green-50 text-green-700 mb-4">
              For Providers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Grow your business with Servly</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
             {[
               { icon: UserPlus, title: "Create Profile", desc: "Sign up and list your services." },
               { icon: Settings, title: "Set Availability", desc: "Control when you want to work." },
               { icon: Bell, title: "Get Bookings", desc: "Receive job requests instantly." },
               { icon: TrendingUp, title: "Get Paid", desc: "Automatic payments to your account." },
               { icon: Shield, title: "Upgrade", desc: "Unlock Pro tools to scale up." },
             ].map((step, i) => (
               <Card key={i} className="text-center border-none shadow-none bg-transparent">
                 <CardContent className="pt-6">
                   <div className="w-16 h-16 mx-auto bg-background rounded-2xl shadow-sm border flex items-center justify-center mb-4 text-primary">
                     <step.icon className="w-8 h-8" />
                   </div>
                   <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                     {i + 1}
                   </div>
                   <h3 className="font-bold mb-2">{step.title}</h3>
                   <p className="text-sm text-muted-foreground">{step.desc}</p>
                 </CardContent>
               </Card>
             ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/auth/signup?role=provider">
              <Button size="lg" variant="outline" className="px-8 h-12 text-lg rounded-xl bg-background">Start Your Business</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
