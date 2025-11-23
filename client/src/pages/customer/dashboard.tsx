import { useState, useEffect } from "react";
import { mockProviders } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { bookingAPI, providerAPI, reviewAPI } from "@/lib/api";
import type { Booking } from "@/lib/data";
import type { Review } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Search, CreditCard, FileText, Download, CheckCircle, Star } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [providerReviews, setProviderReviews] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    if (!user?.id) return;
    const loadBookings = async () => {
      try {
        const bookings = await bookingAPI.getByCustomer(user.id);
        setMyBookings(bookings);
        
        // Load reviews for all providers
        const reviewsByProvider: Record<string, Review[]> = {};
        const uniqueProviders = [...new Set(bookings.map(b => b.providerId))];
        
        await Promise.all(
          uniqueProviders.map(async (providerId) => {
            try {
              const reviews = await reviewAPI.getByProviderId(providerId);
              reviewsByProvider[providerId] = reviews;
            } catch (error) {
              console.error(`Failed to load reviews for provider ${providerId}:`, error);
            }
          })
        );
        
        setProviderReviews(reviewsByProvider);
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

  const handleSubmitReview = async () => {
    if (!reviewingBookingId || !user?.id) return;
    
    const booking = myBookings.find(b => b.id === reviewingBookingId);
    if (!booking) return;
    
    setIsSubmittingReview(true);
    try {
      await reviewAPI.create({
        providerId: booking.providerId,
        customerId: user.id,
        bookingId: reviewingBookingId,
        rating: reviewRating,
        comment: reviewComment,
      });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      setReviewingBookingId(null);
      setReviewRating(5);
      setReviewComment("");
      
      // Reload reviews for this provider
      const reviews = await reviewAPI.getByProviderId(booking.providerId);
      setProviderReviews(prev => ({
        ...prev,
        [booking.providerId]: reviews,
      }));
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "Could not submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
    const providerRating = providerReviews[booking.providerId]?.length > 0
      ? (providerReviews[booking.providerId].reduce((sum, r) => sum + r.rating, 0) / providerReviews[booking.providerId].length).toFixed(1)
      : null;
    const hasReviewed = providerReviews[booking.providerId]?.some(r => r.bookingId === booking.id);

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow border-muted">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                   {provider?.imageUrl ? (
                     <img src={provider.imageUrl} alt={provider.businessName} className="h-full w-full object-cover" />
                   ) : (
                     provider?.businessName.charAt(0)
                   )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{service?.title || 'Service'}</h3>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    With <span className="font-medium text-foreground">{provider?.businessName}</span>
                    {providerRating && (
                      <span className="ml-2 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {providerRating} ({providerReviews[booking.providerId]?.length || 0})
                      </span>
                    )}
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
                  {booking.status === 'completed' && !hasReviewed && (
                    <Button 
                      className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none"
                      onClick={() => setReviewingBookingId(booking.id)}
                    >
                      Write Review
                    </Button>
                  )}
                  {booking.status === 'completed' && hasReviewed && (
                    <Button disabled className="w-full bg-gray-100 text-gray-600 border-0 shadow-none cursor-default">
                      Review Submitted
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
            const booking = myBookings.find((b: Booking) => b.id === selectedInvoice);
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

      {/* Review Dialog */}
      <Dialog open={!!reviewingBookingId} onOpenChange={(open) => !open && setReviewingBookingId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this service provider
            </DialogDescription>
          </DialogHeader>
          
          {reviewingBookingId && (() => {
            const booking = myBookings.find((b: Booking) => b.id === reviewingBookingId);
            const provider = mockProviders.find(p => p.id === booking?.providerId);
            
            return (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {provider?.businessName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{provider?.businessName}</div>
                    <div className="text-sm text-muted-foreground">{booking?.address}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                        className="transition-transform hover:scale-110"
                        data-testid={`rating-${rating}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="review-comment">Comment (Optional)</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Share your thoughts about the service..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewingBookingId(null)}>Cancel</Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmittingReview}
              data-testid="submit-review-button"
            >
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
