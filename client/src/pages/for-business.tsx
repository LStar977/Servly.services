import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Check, Calendar, Users, CreditCard, BarChart3, MessageSquare, Bell, Megaphone } from "lucide-react";

export default function ForBusiness() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Built for Growth.</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Servly isn't just a booking app. It's a complete operating system for your service business.
          </p>
          <Link href="/auth/signup?role=provider">
             <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-white text-slate-900 hover:bg-white/90">
               Join as a Provider
             </Button>
          </Link>
        </div>
      </section>

      {/* Servly Pro Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to run your business</h2>
            <p className="text-muted-foreground text-lg">Replace scattered DMs and spreadsheets with one powerful dashboard.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: "Automated Scheduling", desc: "Set your hours and let customers book instantly. Syncs with your calendar." },
              { icon: Users, title: "Customer Management", desc: "Keep track of client details, history, and preferences in one place." },
              { icon: CreditCard, title: "Built-in Payments", desc: "Secure payment processing with automated payouts and invoicing." },
              { icon: BarChart3, title: "Business Dashboard", desc: "Track earnings, bookings, and growth with real-time analytics." },
              { icon: Bell, title: "Smart Reminders", desc: "Automated notifications reduce no-shows and keep customers informed." },
              { icon: Megaphone, title: "Marketing Tools", desc: "Boost your visibility and get discovered by more local customers." },
              { icon: MessageSquare, title: "Centralized Chat", desc: "Communicate with clients securely without giving out your personal number." },
              { icon: Users, title: "Team Management", desc: "Add employees, assign jobs, and manage schedules as you grow." },
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Your command center</h2>
              <p className="text-lg text-muted-foreground">
                The Servly Pro dashboard gives you a bird's-eye view of your entire operation. 
                From managing today's jobs to planning next month's growth, it's all here.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time booking alerts",
                  "Drag-and-drop calendar",
                  "One-click invoicing",
                  "Performance insights"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Abstract representation of dashboard */}
              <div className="bg-background rounded-2xl shadow-2xl border p-2">
                <div className="bg-muted/20 rounded-xl p-6 space-y-6">
                   <div className="flex justify-between items-center pb-4 border-b">
                      <div className="h-8 w-32 bg-muted rounded-md"></div>
                      <div className="flex gap-2">
                         <div className="h-8 w-8 rounded-full bg-muted"></div>
                         <div className="h-8 w-8 rounded-full bg-muted"></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-blue-50 rounded-lg border border-blue-100 p-4">
                         <div className="h-4 w-16 bg-blue-200 rounded mb-2"></div>
                         <div className="h-8 w-12 bg-blue-300 rounded"></div>
                      </div>
                      <div className="h-24 bg-green-50 rounded-lg border border-green-100 p-4">
                         <div className="h-4 w-16 bg-green-200 rounded mb-2"></div>
                         <div className="h-8 w-12 bg-green-300 rounded"></div>
                      </div>
                      <div className="h-24 bg-purple-50 rounded-lg border border-purple-100 p-4">
                         <div className="h-4 w-16 bg-purple-200 rounded mb-2"></div>
                         <div className="h-8 w-12 bg-purple-300 rounded"></div>
                      </div>
                   </div>
                   <div className="h-64 bg-white rounded-lg border p-4 space-y-4">
                      <div className="h-4 w-48 bg-muted rounded"></div>
                      <div className="space-y-2">
                         {[1,2,3,4].map(j => (
                           <div key={j} className="h-12 w-full bg-muted/30 rounded flex items-center px-4 gap-4">
                              <div className="h-8 w-8 rounded-full bg-muted"></div>
                              <div className="h-4 w-32 bg-muted rounded"></div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Trusted by pros like you</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { quote: "Servly helped us double our monthly bookings in just three months. The automated scheduling is a lifesaver.", author: "Sarah J.", role: "Clean Living Co." },
                 { quote: "Finally, a platform that respects service providers. The payment system ensures I get paid on time, every time.", author: "Mike T.", role: "Mike's Plumbing" },
                 { quote: "The marketing tools helped me reach customers I never would have found on my own. Highly recommended.", author: "David L.", role: "Green Thumb Landscaping" },
               ].map((t, i) => (
                 <Card key={i} className="bg-muted/10 border-none">
                   <CardContent className="pt-8">
                     <div className="mb-6 text-primary">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                         <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                       </svg>
                     </div>
                     <p className="text-lg font-medium mb-6 italic">"{t.quote}"</p>
                     <div>
                       <p className="font-bold">{t.author}</p>
                       <p className="text-sm text-muted-foreground">{t.role}</p>
                     </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that fits your business stage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>For getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Accept jobs on marketplace</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic profile</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> In-app payments</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card className="border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">POPULAR</div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">$99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Marketing Tools</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Free Trial</Button>
              </CardFooter>
            </Card>

            {/* Premium */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>For scaling teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">$199<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Multiple Team Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom Branding</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
