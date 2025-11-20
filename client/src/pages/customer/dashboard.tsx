import { useState } from "react";
import { mockBookings, mockProviders, categories } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Search, CreditCard, CheckCircle, Loader2, Apple } from "lucide-react";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock filtering bookings for this user
  const myBookings = mockBookings.filter(b => b.customerId === (user?.id || 'u1'));

  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'accepted': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'paid': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayNow = (bookingId: string) => {
    setPaymentBookingId(bookingId);
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessingPayment(false);
    setPaymentBookingId(null);
    
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed securely.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your service requests and history.</p>
        </div>
        <Link href="/search">
          <Button size="lg" className="gap-2">
            <Search className="h-4 w-4" /> Find a Service
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {myBookings.length === 0 ? (
          <Card className="p-8 text-center">
             <div className="flex justify-center mb-4">
                <div className="bg-muted p-4 rounded-full">
                   <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
             </div>
             <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
             <p className="text-muted-foreground mb-6">Ready to get started? Find trusted professionals near you.</p>
             <Link href="/search">
               <Button>Book a Service</Button>
             </Link>
          </Card>
        ) : (
          myBookings.map((booking) => {
            const provider = mockProviders.find(p => p.id === booking.providerId);
            const service = provider?.services.find(s => s.id === booking.serviceId);
            
            return (
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{service?.title || 'Service'}</h3>
                        <div className="text-muted-foreground flex items-center gap-1 text-sm mt-1">
                          With <span className="font-medium text-foreground">{provider?.businessName}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)} variant="secondary">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.dateTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(booking.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground italic">
                        "{booking.notes}"
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted/10 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-center gap-3 min-w-[200px]">
                     <div className="text-center md:text-left mb-2">
                       <span className="text-sm text-muted-foreground">Total</span>
                       <div className="text-xl font-bold">${service?.price || 0}</div>
                     </div>
                     
                     {booking.status === 'accepted' && (
                       <Button 
                         className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                         onClick={() => handlePayNow(booking.id)}
                       >
                         <CreditCard className="w-4 h-4 mr-2" />
                         Pay Now
                       </Button>
                     )}

                     {booking.status === 'completed' && (
                       <Button variant="outline" className="w-full">Rate Provider</Button>
                     )}
                     
                     {(booking.status === 'pending') && (
                       <Button variant="destructive" className="w-full bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-none">Cancel Request</Button>
                     )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!paymentBookingId} onOpenChange={(open) => !open && setPaymentBookingId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Securely pay for your service with Servly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Credit Card
                </Label>
              </div>
              <div>
                <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
                <Label
                  htmlFor="apple"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Apple className="mb-3 h-6 w-6" />
                  Apple Pay
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'card' && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                <div className="grid gap-1">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="Alice Customer" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="number">Card Number</Label>
                  <Input id="number" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="month">Expires</Label>
                    <Input id="month" placeholder="MM/YY" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="zip">Zip</Label>
                    <Input id="zip" placeholder="12345" />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'apple' && (
               <div className="py-8 text-center bg-muted/30 rounded-lg border animate-in fade-in slide-in-from-top-2">
                  <div className="bg-black text-white inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer hover:opacity-90 transition-opacity">
                     <Apple className="w-5 h-5 mr-2" /> Pay with Apple Pay
                  </div>
               </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentBookingId(null)}>Cancel</Button>
            <Button onClick={processPayment} disabled={isProcessingPayment} className="bg-green-600 hover:bg-green-700">
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>Pay Securely</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
