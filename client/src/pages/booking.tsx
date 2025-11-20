import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { mockProviders, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Booking() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('providerId');
  
  const provider = mockProviders.find(p => p.id === providerId);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!provider) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button className="mt-4" onClick={() => setLocation('/search')}>Back to Search</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Booking Request Sent!",
      description: `Your request has been sent to ${provider.businessName} for ${date ? format(date, "MMM d") : ''} at ${time}.`,
    });
    
    setIsSubmitting(false);
    setStep(3); // Success step
  };

  // Generate time slots with 15-minute increments
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 19; // 7 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        slots.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center max-w-lg">
         <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
           <CheckCircle className="h-12 w-12" />
         </div>
         <h1 className="text-3xl font-bold mb-4">Request Sent!</h1>
         <p className="text-muted-foreground text-lg mb-8">
           Your booking request has been sent to <strong>{provider.businessName}</strong>. 
           They will review your request and confirm shortly. You can track the status in your dashboard.
         </p>
         <div className="flex gap-4">
           <Button variant="outline" onClick={() => setLocation('/')}>Return Home</Button>
           <Button onClick={() => setLocation('/customer/dashboard')}>Go to Dashboard</Button>
         </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground" onClick={() => setLocation('/search')}>
        ← Back to Search
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Request Booking</h1>
            <p className="text-muted-foreground">Complete the form below to request a service.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Select Service</Label>
                <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                  {provider.services.map(service => (
                    <div key={service.id} className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedService === service.id ? 'border-primary bg-primary/5' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={service.id} id={service.id} />
                        <Label htmlFor={service.id} className="cursor-pointer">
                          <div className="font-medium">{service.title}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </Label>
                      </div>
                      <div className="font-bold">
                        ${service.price}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>Preferred Time</Label>
                  <Select onValueChange={setTime} value={time}>
                    <SelectTrigger className={cn(!time && "text-muted-foreground")}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Service Address</Label>
                <Input 
                  placeholder="123 Main St, City, State" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Notes for Provider (Optional)</Label>
                <Textarea 
                  placeholder="Any special instructions, gate codes, or details about the job..." 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
               {!user ? (
                 <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center text-yellow-800">
                   Please <Link href="/auth/login"><span className="font-bold hover:underline cursor-pointer">log in</span></Link> or <Link href="/auth/signup"><span className="font-bold hover:underline cursor-pointer">sign up</span></Link> to book this service.
                 </div>
               ) : (
                 <Button 
                   className="w-full" 
                   size="lg" 
                   onClick={handleSubmit}
                   disabled={!selectedService || !date || !time || !address || isSubmitting}
                 >
                   {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Booking Request"}
                 </Button>
               )}
            </CardFooter>
          </Card>
        </div>

        {/* Provider Summary Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Provider Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                  {provider.businessName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{provider.businessName}</div>
                  <div className="text-sm text-muted-foreground">{provider.city}</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">★ {provider.rating} ({provider.reviewCount})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">~1 hour</span>
                </div>
              </div>

              {selectedService && (
                 <div className="pt-4 border-t">
                   <div className="flex justify-between font-bold text-lg">
                     <span>Total Estimate</span>
                     <span>${provider.services.find(s => s.id === selectedService)?.price}</span>
                   </div>
                   <p className="text-xs text-muted-foreground mt-1">Final price may vary based on onsite assessment.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
