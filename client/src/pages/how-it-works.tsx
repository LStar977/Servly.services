import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Search, Calendar, CheckCircle, CreditCard, Star, UserPlus, Settings, Bell, TrendingUp, Shield, Watch, Smartphone, Zap, DollarSign, Clock, Heart } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background -z-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4 text-primary/80">
             <Watch className="w-6 h-6 animate-pulse" />
             <Zap className="w-6 h-6" />
             <Smartphone className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">How Servly Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Servly makes it effortless for individuals to book services — and simple for providers to grow their business. Here’s how it works for both sides.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 mb-6">
              For Customers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get it done in 5 easy steps</h2>
          </div>

          <div className="relative max-w-4xl mx-auto mb-20">
            {/* Connecting Line */}
            <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 hidden md:block -translate-x-1/2"></div>

            <div className="space-y-16 md:space-y-0">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">1. Choose a Service</h3>
                  <p className="text-muted-foreground text-lg">Browse our categories or search for exactly what you need help with.</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-xl border-4 border-white dark:border-background order-1 md:order-2 group-hover:scale-110 transition-transform">1</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-white/80 dark:bg-card/80 backdrop-blur p-6 rounded-2xl border shadow-sm w-fit group-hover:shadow-md transition-all">
                     <Search className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group">
                <div className="flex-1 order-3 md:order-1 md:text-right flex justify-end">
                   <div className="bg-white/80 dark:bg-card/80 backdrop-blur p-6 rounded-2xl border shadow-sm w-fit group-hover:shadow-md transition-all">
                     <Calendar className="w-8 h-8 text-primary" />
                   </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-xl border-4 border-white dark:border-background order-1 md:order-2 group-hover:scale-110 transition-transform">2</div>
                <div className="flex-1 order-2 md:order-3">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">2. Pick a Time</h3>
                  <p className="text-muted-foreground text-lg">Select a date and time that works for your schedule.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">3. Get Matched Instantly</h3>
                  <p className="text-muted-foreground text-lg">We'll show you available top-rated professionals in your area.</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-xl border-4 border-white dark:border-background order-1 md:order-2 group-hover:scale-110 transition-transform">3</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-white/80 dark:bg-card/80 backdrop-blur p-6 rounded-2xl border shadow-sm w-fit group-hover:shadow-md transition-all">
                     <CheckCircle className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group">
                <div className="flex-1 order-3 md:order-1 md:text-right flex justify-end">
                   <div className="bg-white/80 dark:bg-card/80 backdrop-blur p-6 rounded-2xl border shadow-sm w-fit group-hover:shadow-md transition-all">
                     <CreditCard className="w-8 h-8 text-primary" />
                   </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-xl border-4 border-white dark:border-background order-1 md:order-2 group-hover:scale-110 transition-transform">4</div>
                <div className="flex-1 order-2 md:order-3">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">4. Pay Securely</h3>
                  <p className="text-muted-foreground text-lg">Handle payments safely through our app. No cash needed.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative group">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">5. Service Completed</h3>
                  <p className="text-muted-foreground text-lg">Relax while the job gets done, then leave a review.</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 shadow-xl border-4 border-white dark:border-background order-1 md:order-2 group-hover:scale-110 transition-transform">5</div>
                <div className="flex-1 order-3 md:order-3">
                   <div className="bg-white/80 dark:bg-card/80 backdrop-blur p-6 rounded-2xl border shadow-sm w-fit group-hover:shadow-md transition-all">
                     <Star className="w-8 h-8 text-primary" />
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-20">
            <Link href="/search">
              <Button size="lg" className="px-10 h-14 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all">Find Services Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Customers Love Servly */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
             <h2 className="text-3xl font-bold mb-6">Why people love using Servly</h2>
             <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
               <div className="flex flex-col items-center text-center">
                 <Shield className="w-10 h-10 text-primary mb-3" />
                 <h4 className="font-bold mb-1">Verified Pros</h4>
                 <p className="text-sm text-muted-foreground">Every provider background checked.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <DollarSign className="w-10 h-10 text-primary mb-3" />
                 <h4 className="font-bold mb-1">Transparent Pricing</h4>
                 <p className="text-sm text-muted-foreground">Know exactly what you'll pay.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <Clock className="w-10 h-10 text-primary mb-3" />
                 <h4 className="font-bold mb-1">Real-time Matching</h4>
                 <p className="text-sm text-muted-foreground">Find help in minutes, not days.</p>
               </div>
               <div className="flex flex-col items-center text-center">
                 <Heart className="w-10 h-10 text-primary mb-3" />
                 <h4 className="font-bold mb-1">24/7 Support</h4>
                 <p className="text-sm text-muted-foreground">We're here whenever you need us.</p>
               </div>
             </div>
          </div>
          
          <div className="max-w-2xl mx-auto bg-background rounded-2xl p-8 shadow-sm border text-center">
             <div className="flex justify-center gap-1 mb-4">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
             </div>
             <p className="text-xl font-medium italic mb-4">"Servly made booking a cleaner easier than ordering food. The professional was on time, polite, and did an amazing job."</p>
             <p className="text-sm text-muted-foreground font-bold">— Morgan S., Toronto</p>
          </div>
        </div>
      </section>

      {/* Demo Video Placeholder */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-8">See Servly in Action</h2>
           <div className="max-w-4xl mx-auto aspect-video bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
             <div className="text-center">
               <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-black border-b-[12px] border-b-transparent ml-1"></div>
               </div>
               <p className="font-medium text-lg">Watch 60s Demo</p>
             </div>
           </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="w-full overflow-hidden leading-[0] transform rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-muted/30">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* For Providers */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-green-50 text-green-700 mb-6">
              For Providers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Grow your business with Servly</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Whether you want new customers or advanced tools to manage your business, Servly gives you both.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto mb-20">
             {[
               { icon: UserPlus, title: "Create Profile", desc: "Sign up and list your services." },
               { icon: Settings, title: "Set Availability", desc: "Control when you want to work." },
               { icon: Bell, title: "Get Bookings", desc: "Receive job requests instantly." },
               { icon: TrendingUp, title: "Get Paid", desc: "Automatic payments to your account." },
               { icon: Shield, title: "Upgrade", desc: "Unlock Pro tools to scale up." },
             ].map((step, i) => (
               <Card key={i} className="text-center border-none shadow-sm hover:shadow-md transition-all bg-background/50 backdrop-blur">
                 <CardContent className="pt-8">
                   <div className="w-16 h-16 mx-auto bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary">
                     <step.icon className="w-8 h-8" />
                   </div>
                   <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                     {i + 1}
                   </div>
                   <h3 className="font-bold mb-2 text-lg">{step.title}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                 </CardContent>
               </Card>
             ))}
          </div>

          {/* Why Partner Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-background border rounded-3xl p-8 md:p-12 shadow-sm">
               <h3 className="text-2xl font-bold text-center mb-8">Why Partner with Servly?</h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold mb-1">Zero Lead Fees</h4>
                        <p className="text-sm text-muted-foreground">Unlike other platforms, we don't charge you for leads. You only pay a small fee when you get paid.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold mb-1">Business Tools Included</h4>
                        <p className="text-sm text-muted-foreground">Get free scheduling, invoicing, and CRM tools to manage your entire business.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold mb-1">Guaranteed Payment</h4>
                        <p className="text-sm text-muted-foreground">We secure funds from customers before the job starts, so you always get paid.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Star className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold mb-1">Build Your Brand</h4>
                        <p className="text-sm text-muted-foreground">Collect reviews, showcase your portfolio, and build a reputation that lasts.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/auth/signup?role=provider">
              <Button size="lg" variant="outline" className="px-10 h-14 text-xl rounded-xl bg-background border-2 hover:bg-muted">Start Your Business</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12">
               Join thousands of happy customers and providers transforming the way services are done.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href="/search">
                  <Button size="lg" variant="secondary" className="h-16 px-8 text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
                     Find Services Near You
                  </Button>
               </Link>
               <Link href="/auth/signup?role=provider">
                  <Button size="lg" variant="outline" className="h-16 px-8 text-xl rounded-2xl bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                     Become a Provider
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
