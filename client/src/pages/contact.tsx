import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone } from "lucide-react";

export default function Contact() {
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Tell us more..." rows={5} />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                 <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                       <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                         <Mail className="h-5 w-5" />
                       </div>
                       <div className="font-bold">Email Support</div>
                       <div className="text-sm text-blue-700">support@servly.com</div>
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
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input placeholder="e.g. Joe's Plumbing" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service Category</Label>
                      <Input placeholder="e.g. Plumbing" />
                    </div>
                    <div className="space-y-2">
                      <Label>Service Area</Label>
                      <Input placeholder="e.g. Chicago, IL" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="(555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="business@email.com" />
                    </div>
                  </div>
                  <Button size="lg" className="w-full" variant="default">Submit Application</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
