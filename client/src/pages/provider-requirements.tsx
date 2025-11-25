import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2, AlertCircle, Lock, Building2, Wrench, Home, Shield, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProviderRequirements() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const requirements = [
    {
      number: 1,
      icon: Lock,
      title: "Identity Verification",
      description: "To prevent fraud and ensure real professionals join the platform, all providers must confirm their identity.",
      mainPoints: {
        "Required (choose one):": ["Driver's License", "Passport", "Provincial/State ID"],
      },
      note: "Only one valid photo ID is needed.",
    },
    {
      number: 2,
      icon: Building2,
      title: "Business or Personal Provider Verification",
      description: "Whether you're a registered business or a solo provider, we need basic proof that your service is legitimate.",
      subcategories: {
        "If you're a registered business:": [
          "Business registration number (BN, EIN, or state/provincial registration)",
          "Business name",
          "Business address"
        ],
        "If you're a solo provider (not a registered business):": [
          "Your legal name",
          "Proof that you provide the service (portfolio, website, business socials)"
        ],
      },
      note: "This ensures all providers are real and compliant — no fake listings.",
    },
    {
      number: 3,
      icon: Wrench,
      title: "Skills, Licensing, or Proof of Experience",
      description: "We accept ALL types of professionals, from licensed trades to creative freelancers. Just provide the type of proof that fits your service.",
      complexLogic: true,
      sections: [
        {
          heading: "If your service requires a license:",
          subtext: "(e.g., plumbing, electrical, HVAC, gas, locksmithing)",
          items: ["Trade license", "Red Seal certification (Canada)", "State/Provincial trade license"]
        },
        {
          heading: "If your service does NOT require a license:",
          subtext: "(e.g., cleaning, beauty, photography, organizing, wellness)",
          items: ["Portfolio or photos of previous work", "Website or business social page", "Google Business Profile", "Client reviews from any platform"]
        }
      ],
      note: "We only require what makes sense for your category.",
    },
    {
      number: 4,
      icon: Home,
      title: "Background Check (In-Home Services Only)",
      description: "If your service requires entering a customer's home or handling personal items, a background check is required—just like Uber, TaskRabbit, and Amazon Home Services.",
      specialLogic: true,
      required: {
        heading: "Required for:",
        items: ["Cleaners", "Movers", "Handypeople", "In-home beauty/wellness", "Care providers", "Home organizers"]
      },
      notRequired: {
        heading: "Not required for:",
        items: ["Lawn care", "Snow removal", "Car detailing", "Photography", "Beauty done at provider's studio", "Tutors", "Consultants", "Outdoor labor"]
      },
      note: "We use a third-party service OR you can upload a recent screening.",
    },
    {
      number: 5,
      icon: Shield,
      title: "Insurance (Only for High-Risk Categories)",
      description: "Not everyone needs insurance. Only certain higher-risk or regulated services must provide proof.",
      mainPoints: {
        "Required for categories like:": ["Plumbing", "Electrical", "HVAC", "Appliance repair", "Contracting / construction"],
        "Accepted:": ["General liability insurance", "Workers' compensation (if you have employees)"]
      },
      note: "Most providers do not need insurance unless required by law or risk level.",
    },
    {
      number: 6,
      icon: CreditCard,
      title: "Payment Setup",
      description: "To receive payouts, providers must connect a secure payout account through Stripe Connect.",
      mainPoints: {
        "Required:": [
          "Legal name or business name",
          "Bank account information",
          "Identity confirmation (handled by Stripe)"
        ]
      },
      note: "This protects you from fraud and ensures you get paid on time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Servly Provider</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Servly connects customers with trusted, verified, and professional service providers.
            To keep our marketplace safe and reliable, we follow a simple and fair verification process — similar to Uber and DoorDash — while keeping onboarding fast and easy.
          </p>
          <Button 
            size="lg"
            disabled={isLoading}
            onClick={handleBecomeProvider}
          >
            {user ? 'Get Started as Provider' : 'Sign Up to Get Started'}
          </Button>
        </div>

        {/* Requirements List */}
        <div className="grid gap-6 mb-12">
          {requirements.map((req) => {
            const IconComponent = req.icon;
            return (
              <Card key={req.number} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{req.title}</CardTitle>
                      <CardDescription className="mt-1">{req.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Standard main points */}
                  {req.mainPoints && (
                    <div className="space-y-3">
                      {Object.entries(req.mainPoints).map(([category, items]) => (
                        <div key={category}>
                          <p className="font-semibold text-sm mb-2">{category}</p>
                          <ul className="space-y-1">
                            {items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subcategories (for requirement 2) */}
                  {req.subcategories && (
                    <div className="space-y-3">
                      {Object.entries(req.subcategories).map(([category, items]) => (
                        <div key={category}>
                          <p className="font-semibold text-sm mb-2">{category}</p>
                          <ul className="space-y-1">
                            {items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Complex logic sections (for requirement 3) */}
                  {req.complexLogic && req.sections && (
                    <div className="space-y-4">
                      {req.sections.map((section, idx) => (
                        <div key={idx} className="bg-muted/30 rounded-lg p-4">
                          <p className="font-semibold text-sm mb-1">{section.heading}</p>
                          <p className="text-xs text-muted-foreground mb-2">{section.subtext}</p>
                          <p className="text-xs text-muted-foreground mb-2">Provide one of:</p>
                          <ul className="space-y-1">
                            {section.items.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special logic for requirement 4 */}
                  {req.specialLogic && req.required && req.notRequired && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-sm text-green-900 mb-2">✔ {req.required.heading}</p>
                        <ul className="space-y-1">
                          {req.required.items.map((item: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-800">✔ {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="font-semibold text-sm text-slate-900 mb-2">– {req.notRequired.heading}</p>
                        <ul className="space-y-1">
                          {req.notRequired.items.map((item: string, idx: number) => (
                            <li key={idx} className="text-sm text-slate-700">– {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {req.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">{req.note}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submission Instructions */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-6 w-6 text-primary" />
              Submit Your Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold mb-2">Ready to join?</p>
              <p className="text-muted-foreground mb-4">
                Please send all required documents to:
              </p>
              <div className="bg-white border-2 border-primary rounded-lg p-4 inline-block">
                <p className="text-xl font-bold text-primary">📩 sservly@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold">Include:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Your full name + contact info</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>The service(s) you want to provide</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>All required verification (ID, proof of work, license if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>A brief description of your experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>⏱️ Processing Time:</strong> Our team reviews applications within 3-5 business days. Once approved, you can start listing your services and accepting bookings immediately!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why We Do This */}
        <Card className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              ⭐ Why We Do This
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These requirements help Servly stay a trusted, safe, and professional marketplace.
              They protect customers, support real providers, and make sure everyone on the platform is legitimate.
            </p>
            <p className="text-muted-foreground">
              We're here to help you grow, build your reputation, and reach more customers who value reliability and quality.
            </p>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button 
            size="lg" 
            disabled={isLoading}
            onClick={async () => {
              if (user) {
                // If logged in, set role to provider
                setIsLoading(true);
                try {
                  const response = await fetch(`/api/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ role: 'provider' }),
                  });
                  if (!response.ok) throw new Error('Failed to update role');
                  toast({
                    title: 'Welcome to Servly!',
                    description: 'Redirecting to your provider dashboard...',
                  });
                  setLocation('/provider/dashboard');
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Could not set provider role',
                    variant: 'destructive',
                  });
                  setIsLoading(false);
                }
              } else {
                // If not logged in, go to signup
                setLocation('/auth/signup');
              }
            }}
          >
            {user ? 'Get Started as Provider' : 'Create Your Account'}
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
