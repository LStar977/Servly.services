import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
             <div className="bg-primary/5 rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10 space-y-6">
                   <div className="text-6xl font-bold text-primary">10k+</div>
                   <div className="text-xl font-medium">Jobs Completed</div>
                   <div className="w-full h-px bg-border"></div>
                   <div className="text-6xl font-bold text-primary">500+</div>
                   <div className="text-xl font-medium">Active Providers</div>
                   <div className="w-full h-px bg-border"></div>
                   <div className="text-6xl font-bold text-primary">4.9</div>
                   <div className="text-xl font-medium">Average Rating</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
           <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
             <p>
               Servly was born out of frustration. In 2023, our founders spent three weeks trying to find a reliable 
               contractor for a simple home repair. The process involved endless phone tag, vague quotes, and missed appointments.
             </p>
             <p>
               We realized that while we could order food, a car, or groceries instantly from our phones, the service industry 
               was still stuck in the era of bulletin boards and voicemails.
             </p>
             <p>
               We built Servly to bridge that gap. To give small businesses the modern tools they deserve to compete with big franchises, 
               and to give customers the seamless experience they expect in the digital age.
             </p>
           </div>
        </div>
      </section>
      
      {/* Team CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the movement</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Whether you're a customer looking for help or a pro looking for work, there's a place for you here.</p>
          <div className="flex justify-center gap-4">
             <Link href="/search">
               <Button size="lg">Find Services</Button>
             </Link>
             <Link href="/auth/signup?role=provider">
               <Button size="lg" variant="outline">Join as Provider</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
