import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface PlatformSettings {
  id: string;
  feePercentage: string;
  basicMonthlyPrice: string;
  proMonthlyPrice: string;
  premiumMonthlyPrice: string;
  updatedAt: string;
}

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [formData, setFormData] = useState({
    feePercentage: "",
    basicMonthlyPrice: "",
    proMonthlyPrice: "",
    premiumMonthlyPrice: "",
  });

  // Check admin access
  if (user && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-red-800">You do not have permission to access the admin settings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data.settings);
      setFormData({
        feePercentage: data.settings.feePercentage,
        basicMonthlyPrice: data.settings.basicMonthlyPrice,
        proMonthlyPrice: data.settings.proMonthlyPrice,
        premiumMonthlyPrice: data.settings.premiumMonthlyPrice,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      toast({
        title: "Success",
        description: "Platform settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Manage fees and subscription pricing</p>
      </div>

      <div className="space-y-6">
        {/* Fee Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Job Fee Percentage</CardTitle>
            <CardDescription>The percentage fee you take from each completed job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fee">Fee Percentage (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fee"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.feePercentage}
                  onChange={(e) => setFormData({ ...formData, feePercentage: e.target.value })}
                  placeholder="15"
                  className="w-full"
                />
                <span className="text-muted-foreground font-medium">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Current: {settings?.feePercentage}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Subscription Plans</CardTitle>
            <CardDescription>Set the pricing for each subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="basic">Basic Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">$</span>
                <Input
                  id="basic"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basicMonthlyPrice}
                  onChange={(e) => setFormData({ ...formData, basicMonthlyPrice: e.target.value })}
                  placeholder="9.99"
                  className="flex-1"
                />
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro">Pro Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">$</span>
                <Input
                  id="pro"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.proMonthlyPrice}
                  onChange={(e) => setFormData({ ...formData, proMonthlyPrice: e.target.value })}
                  placeholder="29.99"
                  className="flex-1"
                />
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium">Premium Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">$</span>
                <Input
                  id="premium"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.premiumMonthlyPrice}
                  onChange={(e) => setFormData({ ...formData, premiumMonthlyPrice: e.target.value })}
                  placeholder="99.99"
                  className="flex-1"
                />
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
