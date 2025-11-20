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
import { CalendarIcon, Loader2, CheckCircle, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Booking() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('providerId');
  
  const provider = mockProviders.find(p => p.id === providerId);
  
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Payment State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  if (!provider) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button className="mt-4" onClick={() => setLocation('/search')}>Back to Search</Button>
      </div>
    );
  }

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true);
    // Simulate Payment Processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Successful",
      description: `Your booking with ${provider.businessName} is confirmed.`,
    });
    
    setIsSubmitting(false);
    setStep(3); // Success step
  };

  const goToPayment = () => {
    if (!selectedService || !date || !address) {
      toast({
         title: "Missing Details",
         description: "Please fill in all required fields.",
         variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  if (step === 3) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center max-w-lg">
         <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
           <CheckCircle className="h-12 w-12" />
         </div>
         <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
         <p className="text-muted-foreground text-lg mb-8">
           Your payment was processed successfully and your booking with <strong>{provider.businessName}</strong> is confirmed. 
           You can track the status in your dashboard.
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
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground" onClick={() => step === 1 ? setLocation('/search') : setStep(1)}>
        ← {step === 1 ? "Back to Search" : "Back to Details"}
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{step === 1 ? "Request Booking" : "Payment"}</h1>
            <p className="text-muted-foreground">{step === 1 ? "Complete the form below to request a service." : "Securely enter your payment details."}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                 <div className="flex items-center justify-between">
                   <span>{step === 1 ? "1. Service Details" : "2. Payment Details"}</span>
                   <div className="flex gap-2">
                     <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                     <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                     <div className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                   </div>
                 </div>
              </CardTitle>
            </CardHeader>
            
            {step === 1 && (
              <CardContent className="space-y-6 animate-in slide-in-from-left-4 duration-300">
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
            )}

            {step === 2 && (
               <CardContent className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-muted/30 p-4 rounded-lg border flex items-center gap-3 mb-6">
                    <Lock className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Payments are secure and encrypted. You won't be charged until the job is completed.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                       <Label>Card Information</Label>
                       <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                             placeholder="0000 0000 0000 0000" 
                             className="pl-9" 
                             value={cardNumber}
                             onChange={(e) => setCardNumber(e.target.value)}
                          />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                       <div className="grid gap-2">
                          <Label>Expiry</Label>
                          <Input 
                             placeholder="MM/YY" 
                             value={expiry}
                             onChange={(e) => setExpiry(e.target.value)}
                          />
                       </div>
                       <div className="grid gap-2">
                          <Label>CVC</Label>
                          <Input 
                             placeholder="123" 
                             value={cvc}
                             onChange={(e) => setCvc(e.target.value)}
                          />
                       </div>
                       <div className="grid gap-2">
                          <Label>Zip Code</Label>
                          <Input 
                             placeholder="12345" 
                             value={zip}
                             onChange={(e) => setZip(e.target.value)}
                          />
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                     <div className="flex items-center justify-between font-bold text-lg mb-2">
                        <span>Total to Pay</span>
                        <span>${provider.services.find(s => s.id === selectedService)?.price}</span>
                     </div>
                     <p className="text-xs text-muted-foreground">Includes all taxes and fees.</p>
                  </div>
               </CardContent>
            )}

            <CardFooter>
               {!user ? (
                 <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center text-yellow-800">
                   Please <Link href="/auth/login"><span className="font-bold hover:underline cursor-pointer">log in</span></Link> or <Link href="/auth/signup"><span className="font-bold hover:underline cursor-pointer">sign up</span></Link> to book this service.
                 </div>
               ) : (
                 step === 1 ? (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={goToPayment}
                      disabled={!selectedService || !date || !address}
                    >
                      Continue to Payment
                    </Button>
                 ) : (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handlePaymentSubmit}
                      disabled={isSubmitting || !cardNumber || !expiry || !cvc}
                    >
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Pay $${provider.services.find(s => s.id === selectedService)?.price}`}
                    </Button>
                 )
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
