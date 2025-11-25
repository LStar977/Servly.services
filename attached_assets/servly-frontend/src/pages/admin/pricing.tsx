import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, DollarSign, Percent } from "lucide-react";

interface PlatformSettings {
  id: string;
  feePercentage: string;
  basicMonthlyPrice: string;
  proMonthlyPrice: string;
  premiumMonthlyPrice: string;
  updatedAt: string;
}

export default function AdminPricing() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [formData, setFormData] = useState({
    feePercentage: "",
    basicMonthlyPrice: "",
    proMonthlyPrice: "",
    premiumMonthlyPrice: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminAPI.getPlatformSettings();
      setSettings(data);
      setFormData({
        feePercentage: data.feePercentage,
        basicMonthlyPrice: data.basicMonthlyPrice,
        proMonthlyPrice: data.proMonthlyPrice,
        premiumMonthlyPrice: data.premiumMonthlyPrice,
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
      const updated = await adminAPI.updatePlatformSettings(formData);
      setSettings(updated);
      toast({
        title: "Success",
        description: "Pricing settings updated successfully",
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
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Job Fee */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Job Fee Percentage
          </CardTitle>
          <CardDescription>The percentage fee taken from each completed job</CardDescription>
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
                className="w-full"
              />
              <span className="text-muted-foreground font-medium">%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Subscription Pricing
          </CardTitle>
          <CardDescription>Set pricing for each subscription tier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Plan */}
            <div className="space-y-2 p-4 border rounded-lg">
              <Label htmlFor="basic" className="font-semibold">Basic Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
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
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="space-y-2 p-4 border rounded-lg border-primary/30 bg-primary/5">
              <Label htmlFor="pro" className="font-semibold">Pro Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
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
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="space-y-2 p-4 border rounded-lg">
              <Label htmlFor="premium" className="font-semibold">Premium Plan</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
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
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Pricing Changes
          </>
        )}
      </Button>
    </div>
  );
}
