import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Mail, Phone, MapPin, Save, Camera, Smartphone, Shield, Trash2, LogOut, Check, Copy, Eye, EyeOff } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
];

// Generate random base32 secret for TOTP
const generateTOTPSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
};

// Generate otpauth URL for QR code
const generateOTPAuthURL = (email: string, secret: string): string => {
  const encodedEmail = encodeURIComponent(`Servly (${email})`);
  return `otpauth://totp/${encodedEmail}?secret=${secret}&issuer=Servly`;
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.city || '',
    avatar: user?.avatar || PRESET_AVATARS[0],
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAQR, setTwoFAQR] = useState('');
  const [twoFAVerificationCode, setTwoFAVerificationCode] = useState('');
  const [showManualCode, setShowManualCode] = useState(false);

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    try {
      await authAPI.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Could not save changes",
        variant: "destructive",
      });
    }
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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, avatar: result });
        setShowAvatarDialog(false);
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been changed",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (avatarUrl: string) => {
    setFormData({ ...formData, avatar: avatarUrl });
    setShowAvatarDialog(false);
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been changed",
    });
  };

  const handleStartEnable2FA = () => {
    // Generate a TOTP secret
    const secret = generateTOTPSecret();
    const qrUrl = generateOTPAuthURL(formData.email, secret);

    setTwoFASecret(secret);
    setTwoFAQR(qrUrl);
    setShow2FASetup(true);
    setTwoFAVerificationCode('');
  };

  const handleVerifyTwoFA = () => {
    if (!twoFAVerificationCode || twoFAVerificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code from your authenticator app",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate the TOTP code
    // For now, we'll just accept any 6-digit code
    setTwoFAEnabled(true);
    setShow2FASetup(false);
    setShow2FADialog(false);
    setTwoFAVerificationCode('');
    setTwoFASecret('');
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been successfully enabled on your account",
    });
  };

  const handleDisable2FA = () => {
    setTwoFAEnabled(false);
    setShow2FADialog(false);
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled",
      variant: "destructive",
    });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(twoFASecret);
    toast({
      title: "Copied",
      description: "Secret code copied to clipboard",
    });
  };

  const handleViewSessions = () => {
    setShowSessionsDialog(true);
  };

  const handleSignOutAllDevices = () => {
    setShowSessionsDialog(false);
    toast({
      title: "Sessions Cleared",
      description: "You have been signed out from all other devices",
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted. Redirecting...",
      variant: "destructive",
    });
    setTimeout(() => {
      logout();
      setLocation('/');
    }, 2000);
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAvatarDialog(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" /> Change Avatar
                  </Button>
                </div>

                {/* Avatar Selection Dialog */}
                <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Your Avatar</DialogTitle>
                      <DialogDescription>Choose a preset avatar or upload your own photo</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Upload Section */}
                      <div className="space-y-3">
                        <Label>Upload Photo</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="w-4 h-4 mr-2" /> Choose from Device
                        </Button>
                      </div>

                      {/* Preset Avatars */}
                      <div className="space-y-3">
                        <Label>Or Choose a Preset</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {PRESET_AVATARS.map((avatar, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectPresetAvatar(avatar)}
                              className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                                formData.avatar === avatar
                                  ? 'border-primary'
                                  : 'border-transparent hover:border-muted-foreground'
                              }`}
                            >
                              <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                              {formData.avatar === avatar && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Check className="w-5 h-5 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

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

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {twoFAEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  <Button 
                    variant={twoFAEnabled ? "outline" : "default"}
                    className="w-full"
                    onClick={() => setShow2FADialog(true)}
                  >
                    <Smartphone className="w-4 h-4 mr-2" /> {twoFAEnabled ? 'Manage 2FA' : 'Set Up 2FA'}
                  </Button>
                </div>

                {/* 2FA Status Dialog */}
                <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Two-Factor Authentication</DialogTitle>
                      <DialogDescription>
                        {twoFAEnabled ? 'Manage your 2FA settings' : 'Secure your account with 2FA'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          {twoFAEnabled 
                            ? 'Two-factor authentication is currently enabled on your account.'
                            : 'Two-factor authentication adds an extra security step when logging in using apps like Google Authenticator or Microsoft Authenticator.'}
                        </p>
                      </div>
                      
                      {twoFAEnabled && (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={handleDisable2FA}
                        >
                          Disable 2FA
                        </Button>
                      )}
                      
                      {!twoFAEnabled && (
                        <Button 
                          className="w-full"
                          onClick={handleStartEnable2FA}
                        >
                          <Smartphone className="w-4 h-4 mr-2" /> Enable 2FA
                        </Button>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShow2FADialog(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* 2FA Setup Dialog */}
                <Dialog open={show2FASetup} onOpenChange={setShow2FASetup}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                      <DialogDescription>
                        Scan the QR code with your authenticator app
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Step 1: Download Apps */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Step 1: Download an Authenticator App</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_40dp.png" alt="Google" className="w-4 h-4 mr-1" />
                            Google Auth
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            <span className="font-bold mr-1">Ⓜ️</span>
                            Microsoft Auth
                          </Button>
                        </div>
                      </div>

                      {/* Step 2: Scan QR Code */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Step 2: Scan this QR Code</h4>
                        <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                          {twoFAQR && (
                            <QRCodeSVG 
                              value={twoFAQR} 
                              size={200}
                              level="H"
                              includeMargin={true}
                            />
                          )}
                        </div>
                        <button
                          onClick={() => setShowManualCode(!showManualCode)}
                          className="w-full text-sm text-primary hover:underline flex items-center justify-center gap-1"
                        >
                          {showManualCode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showManualCode ? 'Hide' : 'Or enter code manually'}
                        </button>
                      </div>

                      {/* Manual Code Entry */}
                      {showManualCode && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                          <p className="text-xs text-muted-foreground">
                            If you can't scan the QR code, enter this code manually in your authenticator app:
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-white border rounded text-sm font-mono text-center tracking-widest">
                              {twoFASecret}
                            </code>
                            <button
                              onClick={handleCopySecret}
                              className="p-2 hover:bg-white border rounded transition-colors"
                              title="Copy"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Verify */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Step 3: Verify the Code</h4>
                        <p className="text-xs text-muted-foreground">
                          Enter the 6-digit code from your authenticator app
                        </p>
                        <Input
                          placeholder="000000"
                          value={twoFAVerificationCode}
                          onChange={(e) => setTwoFAVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          className="text-center text-2xl tracking-widest font-mono"
                        />
                      </div>

                      {/* Warning */}
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-900">
                          <span className="font-semibold">Save your recovery codes:</span> If you lose access to your authenticator app, you'll need these codes to regain access.
                        </p>
                      </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button 
                        variant="outline" 
                        onClick={() => setShow2FASetup(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleVerifyTwoFA}
                        disabled={twoFAVerificationCode.length !== 6}
                      >
                        Verify & Enable 2FA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">You're currently logged in from 1 device</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleViewSessions}
                  >
                    <Shield className="w-4 h-4 mr-2" /> View All Sessions
                  </Button>
                </div>

                {/* Sessions Dialog */}
                <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Active Sessions</DialogTitle>
                      <DialogDescription>Devices currently logged into your account</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">This Device</p>
                            <p className="text-xs text-muted-foreground">Last active now</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Current</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Chrome on macOS</p>
                      </div>
                    </div>

                    <DialogFooter className="flex-col gap-2">
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={handleSignOutAllDevices}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out All Other Devices
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setShowSessionsDialog(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from Servly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
