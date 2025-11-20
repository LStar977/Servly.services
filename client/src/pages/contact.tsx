import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [isProviderSubmitting, setIsProviderSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsContactSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProviderSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Application Received!",
      description: "Thanks for your interest in joining Servly Pro.",
    });
    
    setIsProviderSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact & Support</h1>
          <p className="text-muted-foreground text-lg">We're here to help.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* General Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Get in touch</h2>
                <p className="text-muted-foreground">Have a question or feedback? Send us a message.</p>
              </div>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Name</Label>
                        <Input id="contact-name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Subject</Label>
                      <Input id="contact-subject" placeholder="How can we help?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea id="contact-message" placeholder="Tell us more..." rows={5} required />
                    </div>
                    <Button className="w-full" disabled={isContactSubmitting}>
                      {isContactSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                 <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                       <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                         <Mail className="h-5 w-5" />
                       </div>
                       <div className="font-bold">Email Support</div>
                       <a href="mailto:support@servly.com" className="text-sm text-blue-700 hover:underline">support@servly.com</a>
                    </CardContent>
                 </Card>
                 <Card className="bg-green-50 border-green-100">
                    <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                       <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                         <MessageSquare className="h-5 w-5" />
                       </div>
                       <div className="font-bold">Live Chat</div>
                       <div className="text-sm text-green-700">Available Mon-Fri, 9am-5pm</div>
                    </CardContent>
                 </Card>
              </div>
            </div>

            {/* Provider Application */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Apply as a Provider</h2>
                <p className="text-muted-foreground">Ready to join? Fill out this quick form.</p>
              </div>
              
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle>Provider Application</CardTitle>
                  <CardDescription>Start your journey with Servly Pro</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <form onSubmit={handleProviderSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="biz-name">Business Name</Label>
                      <Input id="biz-name" placeholder="e.g. Joe's Plumbing" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="biz-category">Service Category</Label>
                        <Input id="biz-category" placeholder="e.g. Plumbing" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="biz-area">Service Area</Label>
                        <Input id="biz-area" placeholder="e.g. Chicago, IL" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="biz-phone">Phone</Label>
                        <Input id="biz-phone" type="tel" placeholder="(555) 000-0000" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="biz-email">Email</Label>
                        <Input id="biz-email" type="email" placeholder="business@email.com" required />
                      </div>
                    </div>
                    <Button size="lg" className="w-full" variant="default" disabled={isProviderSubmitting}>
                      {isProviderSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
