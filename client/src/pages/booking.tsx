import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { mockProviders } from "@/lib/data";
import { providerAPI, bookingAPI } from "@/lib/api";
import type { ProviderProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addHours, addDays } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle, Clock, MapPin, CreditCard, Navigation, Apple, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Booking() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('providerId');
  
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [providerLoading, setProviderLoading] = useState(true);

  useEffect(() => {
    if (!providerId) return;
    const loadProvider = async () => {
      try {
        const data = await providerAPI.getById(providerId);
        setProvider(data);
      } catch (error) {
        console.error("Failed to load provider:", error);
        toast({
          title: "Provider not found",
          variant: "destructive",
        });
      } finally {
        setProviderLoading(false);
      }
    };
    loadProvider();
  }, [providerId, toast]);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Load booked appointments for this provider
  useEffect(() => {
    if (!providerId) return;
    const loadBookedSlots = async () => {
      try {
        const bookings = await bookingAPI.getProviderBookings(providerId);
        const bookedTimes = bookings
          .filter(b => ['confirmed', 'accepted', 'completed'].includes(b.status))
          .map(b => new Date(b.dateTime).toISOString().substring(0, 16));
        setBookedSlots(bookedTimes);
      } catch (error) {
        console.error("Failed to load booked slots:", error);
      }
    };
    loadBookedSlots();
  }, [providerId]);

  if (providerLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading provider...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button className="mt-4" onClick={() => setLocation('/search')}>Back to Search</Button>
      </div>
    );
  }

  const generateTimeSlots = (selectedDate: Date) => {
    const slots: Array<{ time: string; isBooked: boolean }> = [];
    const dayName = format(selectedDate, 'EEEE');
    const hours = provider.hoursOfOperation[dayName];
    
    if (!hours || hours.closed) return slots;

    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    
    let current = new Date(selectedDate);
    current.setHours(openHour, openMin, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(closeHour, closeMin, 0);

    // Get appointment interval from provider (default 60 minutes)
    const intervalMinutes = (provider as any).appointmentIntervalMinutes || 60;

    while (current < endTime) {
      const slotTime = format(current, "yyyy-MM-dd'T'HH:mm");
      const isBooked = bookedSlots.includes(slotTime);
      slots.push({ time: slotTime, isBooked });
      current = new Date(current.getTime() + intervalMinutes * 60000);
    }

    return slots;
  };

  const availableSlots = date ? generateTimeSlots(date) : [];
  const timeSlots = availableSlots.map(s => s.time);
  
  const dayName = date ? format(date, 'EEEE') : null;
  const hours = dayName ? provider.hoursOfOperation[dayName] : null;
  const isClosed = hours?.closed;

  const handlePaymentAndBooking = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book",
        variant: "destructive",
      });
      return;
    }

    if (!selectedService || !date || !selectedSlot || !address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking with instant confirmation (no provider approval needed)
      const booking = await bookingAPI.create({
        customerId: user.id,
        providerId: provider.id,
        serviceId: selectedService,
        categoryId: provider.categories[0],
        dateTime: new Date(selectedSlot).toISOString(),
        address,
        notes,
        status: 'confirmed',
      });

      // For now, skip actual Stripe payment and show confirmation
      // In production, you would initiate Stripe checkout here
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment with ${provider.businessName} is confirmed for ${date ? format(date, "MMM d") : ''} at ${selectedSlot}.`,
      });
      
      setBookedSlots(prev => [...prev, selectedSlot]);
      setStep(3);
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Could not create booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    const isMobileService = provider.locationType === 'mobile';
    
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center max-w-2xl animate-in fade-in duration-700">
         <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
           <CheckCircle className="h-10 w-10" />
         </div>
         <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
         <p className="text-muted-foreground text-lg mb-8">
           You're all set for <strong>{date ? format(date, "MMMM do") : ''}</strong> at <strong>{selectedSlot}</strong>.
         </p>

         <Card className="w-full overflow-hidden mb-8 shadow-lg border-muted">
            <div className="h-64 bg-slate-100 relative w-full flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.wired.com%2Fphotos%2F59269cd37034dc5f91bec0f1%2Fmaster%2Fpass%2FGoogleMapTA.jpg&f=1&nofb=1&ipt=b63d6c782249f792e0020505a0022b8b72589d5736489d498826049898530638&ipo=images')] bg-cover bg-center opacity-80"></div>
                
                <div className="absolute inset-0 bg-black/10"></div>
                
                {isMobileService ? (
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl max-w-xs mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                         <Navigation className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm">Provider is nearby</div>
                        <div className="text-xs text-muted-foreground">Est. arrival: On time</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 mb-1">
                      <div className="bg-blue-600 h-1.5 rounded-full w-[35%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>Provider HQ</span>
                      <span>Your Location</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl max-w-xs mx-auto">
                     <div className="flex items-center gap-3 mb-4">
                        <MapPin className="h-8 w-8 text-red-500 fill-red-500" />
                        <div className="text-left">
                          <div className="font-bold">{provider.businessName}</div>
                          <div className="text-xs text-muted-foreground">{provider.address || provider.city}</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => window.open(`https://maps.apple.com/?q=${provider.businessName}`)}>
                           <Apple className="h-3 w-3 mr-1" /> Apple Maps
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${provider.businessName}`)}>
                           <MapPin className="h-3 w-3 mr-1" /> Google Maps
                        </Button>
                     </div>
                  </div>
                )}
            </div>
            <CardContent className="p-6 text-left">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{provider.services.find(s => s.id === selectedService)?.title}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">{provider.businessName}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-bold text-green-600">${provider.services.find(s => s.id === selectedService)?.price}</span>
                </div>
              </div>
            </CardContent>
         </Card>

         <div className="flex gap-4">
           <Button variant="outline" onClick={() => setLocation('/')}>Return Home</Button>
           <Button onClick={() => setLocation('/customer/dashboard')}>View Dashboard</Button>
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
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Complete Booking</h1>
            <p className="text-muted-foreground">Select your service, date & time slot, then complete payment.</p>
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
                      <div className="font-bold">${service.price}</div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Select Date & Time</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm text-muted-foreground">Date</Label>
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
                          disabled={(d) => d < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm text-muted-foreground">Time Slot</Label>
                    {date && isClosed ? (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                        <AlertCircle className="h-4 w-4" /> Closed on {dayName}
                      </div>
                    ) : date && timeSlots.length === 0 ? (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        <AlertCircle className="h-4 w-4" /> No slots available
                      </div>
                    ) : (
                      <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                        <SelectTrigger className={cn(!selectedSlot && "text-muted-foreground")}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {availableSlots.map(({ time: slot, isBooked }) => {
                            const slotDisplay = format(new Date(slot), 'h:mm a');
                            return (
                              <SelectItem 
                                key={slot} 
                                value={slot} 
                                disabled={isBooked}
                                className={isBooked ? "opacity-50 line-through" : ""}
                              >
                                {slotDisplay} {isBooked ? '(Booked)' : ''}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {date && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Hours:</strong> {hours?.closed ? 'Closed' : `${hours?.open} - ${hours?.close}`}
                  </div>
                )}
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
                <Label>Notes (Optional)</Label>
                <Textarea 
                  placeholder="Any special instructions..." 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
               <CardTitle>2. Payment</CardTitle>
            </CardHeader>
            <CardContent>
               <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                   <RadioGroupItem value="card" id="card" className="peer sr-only" />
                   <Label
                     htmlFor="card"
                     className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                   >
                     <CreditCard className="mb-3 h-6 w-6" />
                     Credit Card
                   </Label>
                 </div>
                 <div>
                   <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
                   <Label
                     htmlFor="apple"
                     className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                   >
                     <Apple className="mb-3 h-6 w-6" />
                     Apple Pay
                   </Label>
                 </div>
               </RadioGroup>

               {paymentMethod === 'card' && (
                 <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                   <div className="grid gap-2">
                     <Label htmlFor="name">Name on Card</Label>
                     <Input id="name" placeholder="John Doe" />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="number">Card Number</Label>
                     <Input id="number" placeholder="0000 0000 0000 0000" />
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <div className="grid gap-2">
                       <Label htmlFor="month">Expires</Label>
                       <Input id="month" placeholder="MM/YY" />
                     </div>
                     <div className="grid gap-2">
                       <Label htmlFor="cvc">CVC</Label>
                       <Input id="cvc" placeholder="123" />
                     </div>
                     <div className="grid gap-2">
                       <Label htmlFor="zip">Zip</Label>
                       <Input id="zip" placeholder="12345" />
                     </div>
                   </div>
                 </div>
               )}

               {paymentMethod === 'apple' && (
                  <div className="py-6 text-center bg-muted/30 rounded-lg border animate-in fade-in slide-in-from-top-2">
                     <div className="bg-black text-white inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity">
                        <Apple className="w-5 h-5 mr-2" /> Pay with Apple Pay
                     </div>
                  </div>
               )}
            </CardContent>
            <CardFooter>
               {!user ? (
                 <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center text-yellow-800">
                   Please <Link href="/auth/login"><span className="font-bold hover:underline cursor-pointer">log in</span></Link> or <Link href="/auth/signup"><span className="font-bold hover:underline cursor-pointer">sign up</span></Link> to book this service.
                 </div>
               ) : (
                 <Button 
                   className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg" 
                   size="lg" 
                   onClick={handlePaymentAndBooking}
                   disabled={!selectedService || !date || !selectedSlot || !address || isSubmitting}
                 >
                   {isSubmitting ? (
                     <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
                   ) : (
                     `Pay $${provider.services.find(s => s.id === selectedService)?.price || 0} & Book`
                   )}
                 </Button>
               )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                  {provider.imageUrl ? (
                    <img src={provider.imageUrl} alt={provider.businessName} className="h-full w-full object-cover" />
                  ) : (
                    provider.businessName.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold">{provider.businessName}</div>
                  <div className="text-sm text-muted-foreground">{provider.city}</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t text-sm">
                {selectedService && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{provider.services.find(s => s.id === selectedService)?.title}</span>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(date, "MMM d, yyyy")}</span>
                  </div>
                )}
                {selectedSlot && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{format(new Date(selectedSlot), 'h:mm a')}</span>
                  </div>
                )}
              </div>

              {selectedService && (
                 <div className="pt-4 border-t">
                   <div className="flex justify-between font-bold text-lg">
                     <span>Total</span>
                     <span>${provider.services.find(s => s.id === selectedService)?.price}</span>
                   </div>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
