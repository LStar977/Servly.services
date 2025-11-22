import { useState, useEffect } from "react";
import { mockProviders } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { bookingAPI, providerAPI } from "@/lib/api";
import type { Booking } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Search, CreditCard, FileText, Download, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const loadBookings = async () => {
      try {
        const bookings = await bookingAPI.getByCustomer(user.id);
        setMyBookings(bookings);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        toast({
          title: "Failed to load bookings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, [user?.id, toast]);

  const activeBookings = myBookings.filter(b => ['pending', 'accepted'].includes(b.status));
  const completedBookings = myBookings.filter(b => ['completed', 'cancelled', 'paid'].includes(b.status));

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

  const handleDownloadInvoice = () => {
    toast({
      title: "Downloading Invoice...",
      description: "Your invoice PDF has been downloaded.",
    });
    setSelectedInvoice(null);
  };

  const BookingCard = ({ booking, isCompleted = false }: { booking: any, isCompleted?: boolean }) => {
    const provider = mockProviders.find(p => p.id === booking.providerId);
    const service = provider?.services.find(s => s.id === booking.serviceId);

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-muted">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                   {provider?.imageUrl ? (
                     <img src={provider.imageUrl} alt={provider.businessName} className="h-full w-full object-cover" />
                   ) : (
                     provider?.businessName.charAt(0)
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{service?.title || 'Service'}</h3>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    With <span className="font-medium text-foreground">{provider?.businessName}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)} variant="secondary">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm pl-16">
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
          </div>
          
          <div className="bg-muted/10 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-center gap-3 min-w-[200px]">
             <div className="text-center md:text-left mb-2 pl-1">
               <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</span>
               <div className="text-xl font-bold">${service?.price || 0}</div>
             </div>
             
             {isCompleted ? (
               <div className="space-y-2">
                  <Button variant="outline" className="w-full gap-2" onClick={() => setSelectedInvoice(booking.id)}>
                    <FileText className="h-4 w-4" /> View Invoice
                  </Button>
                  {booking.status === 'completed' && (
                    <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none">
                      Write Review
                    </Button>
                  )}
               </div>
             ) : (
               <div className="space-y-2">
                 {booking.status === 'accepted' && (
                   <Button 
                     className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                   >
                     <CreditCard className="w-4 h-4 mr-2" />
                     Pay Now
                   </Button>
                 )}
                 
                 {(booking.status === 'pending') && (
                   <Button variant="destructive" className="w-full bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-none">
                     Cancel Request
                   </Button>
                 )}
               </div>
             )}
          </div>
        </div>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to view your bookings</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {isLoading && <p className="text-muted-foreground mb-4">Loading bookings...</p>}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Requests</h1>
          <p className="text-muted-foreground">Manage your service requests and view history.</p>
        </div>
        <Link href="/search">
          <Button size="lg" className="gap-2">
            <Search className="h-4 w-4" /> Find a Service
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
          <TabsTrigger value="active">New Requests ({activeBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed History ({completedBookings.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6 animate-in fade-in-50 duration-300">
          {activeBookings.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
               <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-full">
                     <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
               </div>
               <h3 className="text-lg font-semibold mb-2">No active requests</h3>
               <p className="text-muted-foreground mb-6">Ready to get started? Find trusted professionals near you.</p>
               <Link href="/search">
                 <Button>Book a Service</Button>
               </Link>
            </Card>
          ) : (
            activeBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6 animate-in fade-in-50 duration-300">
          {completedBookings.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
               <div className="flex justify-center mb-4">
                  <div className="bg-muted p-4 rounded-full">
                     <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
               </div>
               <h3 className="text-lg font-semibold mb-2">No completed history</h3>
               <p className="text-muted-foreground">Your past bookings and invoices will appear here.</p>
            </Card>
          ) : (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isCompleted={true} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Invoice Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Invoice Details
            </DialogTitle>
            <DialogDescription>
              Invoice #{selectedInvoice?.toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (() => {
            const booking = mockBookings.find(b => b.id === selectedInvoice);
            const provider = mockProviders.find(p => p.id === booking?.providerId);
            const service = provider?.services.find(s => s.id === booking?.serviceId);
            
            return (
              <div className="py-4 space-y-6">
                <div className="flex justify-between border-b pb-6">
                  <div>
                    <div className="font-bold text-xl mb-1">Servly</div>
                    <div className="text-sm text-muted-foreground">Service Marketplace</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Date Issued</div>
                    <div className="text-sm text-muted-foreground">{format(new Date(), 'MMM d, yyyy')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-2">Billed To</div>
                    <div className="font-medium">{user?.name || 'Customer Name'}</div>
                    <div className="text-sm text-muted-foreground">{booking?.address}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-2">Provider</div>
                    <div className="font-medium">{provider?.businessName}</div>
                    <div className="text-sm text-muted-foreground">{provider?.city}</div>
                    <div className="text-sm text-muted-foreground">{provider?.phone}</div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-3 text-sm font-medium grid grid-cols-4">
                    <div className="col-span-3">Description</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="p-4 text-sm grid grid-cols-4 border-b last:border-0">
                    <div className="col-span-3">
                      <div className="font-medium">{service?.title}</div>
                      <div className="text-muted-foreground text-xs">{service?.description}</div>
                    </div>
                    <div className="text-right font-medium">${service?.price?.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-muted/10 grid grid-cols-4 items-center">
                    <div className="col-span-3 font-bold text-right pr-4">Total</div>
                    <div className="text-right font-bold text-lg">${service?.price?.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm flex items-center justify-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4" /> Paid via Credit Card ending in 4242
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
            <Button onClick={handleDownloadInvoice} className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
