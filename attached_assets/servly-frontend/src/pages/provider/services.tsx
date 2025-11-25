import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Edit2, DollarSign } from "lucide-react";

const SERVICE_CATEGORIES = [
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'landscaping', name: 'Landscaping' },
  { id: 'moving', name: 'Moving' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'snow_removal', name: 'Snow Removal' },
  { id: 'pet_services', name: 'Pet Services' },
];

const PRICE_UNITS = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'job', label: 'Per Job' },
  { value: 'visit', label: 'Per Visit' },
];

interface Service {
  id: string;
  title: string;
  description?: string;
  price: string;
  priceUnit: string;
  categoryId: string;
  providerId: string;
}

export default function ProviderServices() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceUnit: 'job',
    categoryId: 'cleaning',
  });

  useEffect(() => {
    if (user?.id) {
      loadServices();
    }
  }, [user?.id]);

  const loadServices = async () => {
    try {
      const response = await fetch(`/api/providers/${user?.id}/services`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load your services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        providerId: user?.id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        priceUnit: formData.priceUnit,
        categoryId: formData.categoryId,
      };

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save service');
      const data = await response.json();
      
      setServices([...services, data.service]);
      resetForm();
      setShowDialog(false);
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save service",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete service');
      setServices(services.filter(s => s.id !== serviceId));
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      priceUnit: 'job',
      categoryId: 'cleaning',
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground mt-2">Create and manage the services you offer</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground mb-4">No services yet. Create your first service to get started.</p>
            <Button onClick={() => { resetForm(); setShowDialog(true); }}>Add Your First Service</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const category = SERVICE_CATEGORIES.find(c => c.id === service.categoryId);
            const unit = PRICE_UNITS.find(u => u.value === service.priceUnit);
            return (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2">{category?.name}</Badge>
                    </div>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.description && (
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">${service.price}</span>
                    <span className="text-sm text-muted-foreground">{unit?.label}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>Create a new service offering for your business</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Name *</Label>
              <Input
                id="title"
                placeholder="e.g., House Cleaning, Plumbing Repair"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what your service includes"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.priceUnit} onValueChange={(value) => setFormData({ ...formData, priceUnit: value })}>
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_UNITS.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
