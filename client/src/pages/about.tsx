import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Rocket, Clock, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">About Servly</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             We're on a mission to simplify how the world gets work done.
           </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  To create a frictionless marketplace that empowers local service professionals to grow their businesses 
                  while giving customers the easiest way to maintain their homes and lives.
                </p>
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We see a future where booking a plumber is as easy as ordering a pizza, and where skill and reliability 
                  are the only currencies that matter for a service business to succeed.
                </p>
             </div>
             
             {/* Launch Status Box */}
             <div className="bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-start h-full justify-center">
                   <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/10">
                      <Rocket className="w-4 h-4 text-yellow-400" /> Launching Early 2026
                   </div>
                   
                   <h3 className="text-3xl font-bold mb-4">Servly is currently in development.</h3>
                   <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                      We’re building our provider community and preparing for launch. Join the waitlist to be first in line.
                   </p>
                   
                   <div className="space-y-4 w-full">
                      <div className="flex items-center gap-3 text-slate-300">
                         <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></div>
                         <span>Provider onboarding in progress</span>
                      </div>
                      <div className="w-full h-px bg-white/10"></div>
                   </div>

                   <Button size="lg" className="w-full mt-8 h-12 text-lg bg-white text-slate-900 hover:bg-white/90 font-bold">
                      Join the Waitlist <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
           </div>
           
           <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
             <p>
               Servly was created because finding reliable local services shouldn’t be this hard — and running a small service business shouldn’t feel impossible.
             </p>
             <p>
               After working in customer service and helping manage a small family business, I experienced both sides of the problem:
               the people who need help but don’t know who to trust, and the small business owners who provide great work but struggle to get consistent customers without expensive ads or complicated tools.
             </p>
             <p>
               I saw how many everyday tasks still rely on phone tag, outdated directories, and guesswork. Meanwhile, large companies have access to automation, scheduling software, and marketing systems — tools most small businesses can’t afford.
             </p>
             <p className="font-medium text-primary">
               Servly was built to bridge that gap.
             </p>
             <p>
               We’re creating a platform where customers can book trusted professionals as easily as ordering a ride, and where small businesses get modern tools, visibility, and opportunity all in one place.
             </p>
             <p>
               Servly isn’t just a marketplace. It’s a movement to make work easier, faster, and fairer for everyone.
             </p>
           </div>

           <div className="mt-16 bg-background rounded-2xl p-8 border shadow-sm text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
                 <Clock className="w-5 h-5" /> Launching Early 2026
              </div>
              <h3 className="text-xl font-bold mb-4">We’re currently onboarding early providers and building our community.</h3>
              <p className="text-muted-foreground mb-8">Join the waitlist to get early access when we launch.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Button size="lg" className="w-full sm:w-auto">Join the Waitlist</Button>
                 <Link href="/auth/signup?role=provider">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">Sign up as a Provider</Button>
                 </Link>
              </div>
           </div>
        </div>
      </section>
      
      {/* Team CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the movement</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Whether you're a customer looking for help or a pro looking for work, there's a place for you here.</p>
          <div className="flex justify-center gap-4">
             <Button size="lg">Join Waitlist</Button>
             <Link href="/auth/signup?role=provider">
               <Button size="lg" variant="outline">Join as Provider</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
