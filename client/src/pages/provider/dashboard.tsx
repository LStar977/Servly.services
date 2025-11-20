import { useState } from "react";
import { mockBookings, mockProviders, categories, Booking } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock provider ID (assuming logged in user is linked to p1)
  const providerId = 'p1';
  const provider = mockProviders.find(p => p.id === providerId);
  
  // Local state for bookings to simulate updates
  const [bookings, setBookings] = useState(
    mockBookings.filter(b => b.providerId === providerId)
  );

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    
    toast({
      title: "Status Updated",
      description: `Booking marked as ${newStatus}`,
    });
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const upcomingBookings = bookings.filter(b => b.status === 'accepted');
  const pastBookings = bookings.filter(b => ['completed', 'cancelled', 'declined'].includes(b.status));

  const BookingCard = ({ booking, showActions = false }: { booking: Booking, showActions?: boolean }) => {
    const service = provider?.services.find(s => s.id === booking.serviceId);
    
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
               <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <User className="h-5 w-5" />
               </div>
               <div>
                 <h3 className="font-bold text-lg">Customer Name</h3>
                 <p className="text-sm text-muted-foreground">New Customer</p>
               </div>
            </div>
            <Badge variant={booking.status === 'pending' ? 'secondary' : 'outline'} className="capitalize">
              {booking.status}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
             <div>
               <p className="text-muted-foreground mb-1">Service</p>
               <p className="font-medium">{service?.title}</p>
             </div>
             <div>
               <p className="text-muted-foreground mb-1">Date & Time</p>
               <p className="font-medium">
                 {new Date(booking.dateTime).toLocaleDateString()} at {new Date(booking.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </p>
             </div>
             <div className="md:col-span-2">
               <p className="text-muted-foreground mb-1">Location</p>
               <p className="font-medium flex items-center gap-1">
                 <MapPin className="h-3 w-3" /> {booking.address}
               </p>
             </div>
          </div>
          
          {booking.notes && (
            <div className="bg-muted/30 p-3 rounded-md text-sm italic text-muted-foreground mb-4">
              "{booking.notes}"
            </div>
          )}
          
          {showActions && (
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2" onClick={() => handleStatusChange(booking.id, 'accepted')}>
                <CheckCircle className="h-4 w-4" /> Accept Request
              </Button>
              <Button variant="outline" className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(booking.id, 'declined')}>
                <XCircle className="h-4 w-4" /> Decline
              </Button>
            </div>
          )}
          
          {booking.status === 'accepted' && (
             <Button className="w-full gap-2" variant="secondary" onClick={() => handleStatusChange(booking.id, 'completed')}>
               <CheckCircle className="h-4 w-4" /> Mark as Completed
             </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Portal</h1>
          <p className="text-muted-foreground">Welcome back, {provider?.businessName}</p>
        </div>
        <div className="flex items-center gap-2 bg-card border p-2 rounded-lg">
           <Switch id="availability" defaultChecked />
           <Label htmlFor="availability" className="text-sm font-medium cursor-pointer">Accepting New Jobs</Label>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="requests" className="relative">
            Requests
            {pendingBookings.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                {pendingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-xl font-semibold mb-4">New Requests</h2>
            {pendingBookings.length === 0 ? (
              <div className="text-center p-12 border rounded-xl bg-muted/10 border-dashed">
                <p className="text-muted-foreground">No new booking requests.</p>
              </div>
            ) : (
              pendingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Jobs</h2>
            {upcomingBookings.length === 0 ? (
              <div className="text-center p-12 border rounded-xl bg-muted/10 border-dashed">
                <p className="text-muted-foreground">No upcoming jobs scheduled.</p>
              </div>
            ) : (
              upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
          
          <div className="pt-8 border-t">
             <h2 className="text-xl font-semibold mb-4">Past History</h2>
             <div className="opacity-70">
               {pastBookings.map(booking => (
                 <BookingCard key={booking.id} booking={booking} />
               ))}
             </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>Manage your public profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue={provider?.businessName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea defaultValue={provider?.description} rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue={provider?.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input defaultValue={provider?.city} />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>Services you offer to customers</CardDescription>
                  </div>
                  <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Service</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {provider?.services.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{service.title}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${service.price}</div>
                        <div className="text-xs text-muted-foreground">per {service.priceUnit}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle>Availability</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2">
                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                       <div key={day} className="flex items-center justify-between">
                         <span className="text-sm">{day}</span>
                         <Switch defaultChecked={provider?.availability.includes(day)} />
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
