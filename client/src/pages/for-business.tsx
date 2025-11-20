import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { Check, Calendar, Users, CreditCard, BarChart3, MessageSquare, Bell, Megaphone, Truck, Wrench, Zap, Shield, BadgeCheck } from "lucide-react";

export default function ForBusiness() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">Built for Growth.</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Servly isn't just a booking app — it's a complete operating system for your service business.
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Whether you're a solo operator or a growing team, Servly helps you get more customers, automate your workflow, and manage everything in one place.
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
            <p className="text-muted-foreground text-lg">Replace scattered DMs, phone calls, and spreadsheets with one powerful dashboard.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: "Automated Scheduling", desc: "Set your hours and let customers book instantly — synced to your calendar." },
              { icon: Users, title: "Customer Management", desc: "Keep track of client history, notes, preferences, and repeat bookings all in one place." },
              { icon: CreditCard, title: "Built-in Payments", desc: "Secure, fast payouts with automated invoicing." },
              { icon: BarChart3, title: "Business Dashboard", desc: "Track earnings, bookings, performance, and growth in real time." },
              { icon: Bell, title: "Smart Reminders", desc: "Reduce no-shows with automatic notifications." },
              { icon: Megaphone, title: "Marketing Tools", desc: "Boost your visibility and get discovered by more local customers." },
              { icon: MessageSquare, title: "Centralized Chat", desc: "Message customers securely without sharing your personal number." },
              { icon: Users, title: "Team Management", desc: "Add team members, assign jobs, and manage schedules as you grow." },
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

      {/* Who Servly Is For */}
      <section className="py-24 bg-muted/30">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Servly Is For</h2>
               <p className="text-muted-foreground text-lg">Servly supports a wide range of service professionals and small businesses.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-sm font-medium">
               {[
                  "🧼 Home Cleaners", "🌿 Lawn & Landscaping", "🚗 Auto Detailers", "❄️ Snow Removal",
                  "🔧 Handyman Services", "⚡ Electricians", "🚰 Plumbers", "🐶 Pet Sitters / Walkers",
                  "🚚 Movers", "🏠 Housekeeping", "🌸 Home Organizing", "🗑 Junk Removal",
                  "🧹 Janitorial Services", "🔥 HVAC & Maintenance", "🪴 Gardeners", "🛠 Mobile Services",
                  "🧺 Laundry Services", "🏘 Residential Services", "🏢 Commercial Services", "🟦 Other / Not Listed?"
               ].map((item, i) => (
                  <div key={i} className="bg-background p-4 rounded-lg border shadow-sm flex items-center justify-center text-center h-full hover:border-primary/50 transition-colors">
                     {item}
                  </div>
               ))}
            </div>
            
            <div className="text-center mt-12 max-w-2xl mx-auto">
               <p className="text-muted-foreground mb-6">
                  Apply with your service — if it fits our marketplace standards, we’ll onboard you. 
                  Servly welcomes unique and specialized service providers.
               </p>
            </div>
         </div>
      </section>

      {/* Grow Business Section */}
      <section className="py-24">
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-10">
                  <div>
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">Grow your business with Servly</h2>
                  </div>
                  
                  <div className="space-y-8">
                     <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                           <Zap className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-2">Get booked instantly</h3>
                           <p className="text-muted-foreground">No bidding wars. No quoting. No chasing leads. Customers see your availability and book you instantly.</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                           <BadgeCheck className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-2">Automate your operations</h3>
                           <p className="text-muted-foreground">Scheduling, payments, chat, reminders, and analytics — all in one app.</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                           <Users className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-2">Build repeat customers</h3>
                           <p className="text-muted-foreground">Servly helps you get recurring weekly, biweekly, or monthly clients.</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                           <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold mb-2">Scale like a real company</h3>
                           <p className="text-muted-foreground">Tools to help you expand your team, increase earnings, and grow efficiently.</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-muted/30 p-8 rounded-3xl border">
                  <h3 className="font-bold text-2xl mb-6 text-center">What Makes Servly Different?</h3>
                  <div className="space-y-4">
                     <div className="grid grid-cols-4 gap-4 text-sm font-bold pb-2 border-b text-muted-foreground">
                        <div className="col-span-2">Feature</div>
                        <div className="text-center text-primary">Servly</div>
                        <div className="text-center">Others</div>
                     </div>
                     {[
                        { name: "Instant booking", servly: true, other: false },
                        { name: "Real scheduling system", servly: true, other: false },
                        { name: "All-in-one business tools", servly: true, other: false },
                        { name: "Verified customers", servly: true, other: false },
                        { name: "No bidding wars", servly: true, other: false },
                        { name: "Repeat reminders", servly: true, other: false },
                        { name: "Designed for small biz", servly: true, other: false },
                     ].map((row, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 items-center py-2 border-b last:border-0">
                           <div className="col-span-2 font-medium">{row.name}</div>
                           <div className="flex justify-center text-green-500"><Check className="w-5 h-5" /></div>
                           <div className="flex justify-center text-muted-foreground/50">❌</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Dashboard Showcase - Your Command Center */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Your Command Center</h2>
              <p className="text-lg text-slate-300">
                The Servly Pro dashboard gives you a full bird’s-eye view of your entire operation.
                From managing today’s bookings to planning next month’s growth, it’s all here.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time booking alerts",
                  "Drag-and-drop calendar",
                  "One-click invoicing",
                  "Performance insights"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Abstract representation of dashboard */}
              <div className="bg-white rounded-2xl shadow-2xl border border-white/10 p-2">
                <div className="bg-slate-100 rounded-xl p-6 space-y-6 text-slate-900">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
                      <div className="flex gap-2">
                         <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                         <div className="h-8 w-8 rounded-full bg-slate-200"></div>
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
                   <div className="h-64 bg-white rounded-lg border border-slate-200 p-4 space-y-4">
                      <div className="h-4 w-48 bg-slate-100 rounded"></div>
                      <div className="space-y-2">
                         {[1,2,3,4].map(j => (
                           <div key={j} className="h-12 w-full bg-slate-50 rounded flex items-center px-4 gap-4">
                              <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                              <div className="h-4 w-32 bg-slate-200 rounded"></div>
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
                <CardDescription>For solo operators getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Accept bookings</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic profile</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> In-app payments</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Customer messaging</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card className="border-primary relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">POPULAR</div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">$99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Analytics dashboard</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Marketing tools</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Faster payouts</li>
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
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced team tools</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
         <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
               <AccordionItem value="item-1">
                  <AccordionTrigger>How do I get paid?</AccordionTrigger>
                  <AccordionContent>
                     You’ll receive payouts directly to your bank account through Servly’s secure payment system. We process payments automatically once a job is marked complete.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-2">
                  <AccordionTrigger>What fees does Servly charge?</AccordionTrigger>
                  <AccordionContent>
                     We charge a small transaction fee on bookings to cover payment processing and platform costs. The Pro and Premium plans are optional monthly subscriptions that unlock advanced growth tools.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-3">
                  <AccordionTrigger>Do I need to be a registered business?</AccordionTrigger>
                  <AccordionContent>
                     No — solo operators, freelancers, and side-hustlers can join too. We welcome anyone who provides high-quality service.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-4">
                  <AccordionTrigger>Can I bring my own clients?</AccordionTrigger>
                  <AccordionContent>
                     Yes! You can add your existing customers and manage them inside Servly for free. It's a great way to consolidate your business in one place.
                  </AccordionContent>
               </AccordionItem>
               <AccordionItem value="item-5">
                  <AccordionTrigger>Is there a contract?</AccordionTrigger>
                  <AccordionContent>
                     No commitments. You can cancel your Pro or Premium subscription anytime. The free plan is free forever.
                  </AccordionContent>
               </AccordionItem>
            </Accordion>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
         <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to grow your service business?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
               Join thousands of professionals using Servly to simplify operations, increase bookings, and run smarter.
            </p>
            <Link href="/auth/signup?role=provider">
               <Button size="lg" className="h-16 px-10 text-xl rounded-2xl bg-white text-slate-900 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all">
                  Join as a Provider
               </Button>
            </Link>
         </div>
      </section>
    </div>
  );
}
