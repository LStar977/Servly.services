import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Save, Camera } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.city || '',
    avatar: user?.avatar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setPasswordForm({ current: '', new: '', confirm: '' });
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and personal information</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Info Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-lg">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" /> Change Avatar
                  </Button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 bg-transparent outline-none text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="flex-1 bg-transparent outline-none text-sm"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input 
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>

                  <Button onClick={handleChangePassword} className="w-full">
                    Update Password
                  </Button>
                </div>

                {/* Other Security Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <Button variant="outline" className="w-full">Enable 2FA</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">You're currently logged in from 1 device</p>
                  <Button variant="outline" className="w-full">View All Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="w-full">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
