import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProviderRequirements() {
  const requirements = [
    {
      number: 1,
      title: "Identity Verification",
      description: "To prevent fraud and ensure only real professionals join the platform, all providers must complete a secure ID check.",
      items: ["Driver's License", "Passport", "Provincial/State ID"],
    },
    {
      number: 2,
      title: "Business Verification",
      description: "Servly only accepts legitimate service providers — whether you're a registered business or a licensed sole proprietor.",
      items: ["Business registration number (BN, EIN, or State/Provincial registration)", "Legal business name", "Business address (must match registration)"],
      note: "It helps us confirm your business is real, compliant, and ready to serve customers.",
    },
    {
      number: 3,
      title: "Licenses or Certifications (Service-Specific)",
      description: "Some categories require official credentials.",
      items: ["Trade license (plumbing, electrical, HVAC, gas fitting, etc.)", "Red Seal certification (Canada)", "State/Provincial professional license", "Cosmetology / esthetician certifications", "Locksmith certification", "Apprenticeship proof (for regulated trade helpers)"],
    },
    {
      number: 4,
      title: "Insurance Requirements",
      description: "For certain high-risk categories, we require proof of valid insurance.",
      subcategories: {
        "Needed for categories such as:": ["Plumbing, electrical, HVAC", "Appliance repair", "Moving services", "Construction / contracting", "Wellness services (if required in your region)"],
        "Accepted insurance types:": ["General liability insurance", "Workers' compensation (if you have employees)"],
      },
    },
    {
      number: 5,
      title: "Background Check (In-Home Services)",
      description: "If your service requires entering a customer's home or handling personal items, a background check is required.",
      items: ["Cleaners", "Movers", "Handypeople", "Wellness/beauty providers", "Care providers"],
      note: "We may use a third-party service (e.g., Certn, Checkr) or you can upload a recent screening.",
    },
    {
      number: 6,
      title: "Proof of Experience or Work Samples",
      description: "To help customers trust your business, we require one of the following:",
      items: ["Website or business social media page", "Google Business Profile", "Portfolio or photos of previous work", "Links to reviews from other platforms"],
      note: "This helps us verify the quality and authenticity of your services.",
    },
    {
      number: 7,
      title: "Payment Verification",
      description: "To receive payouts, you must connect a verified payout account through Stripe Connect, our secure payment partner.",
      items: ["Legal business name", "Bank account details", "Identity confirmation"],
      note: "This protects you against fraud and ensures you get paid on time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How to Become a Servly Provider</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Servly exists to connect customers with trusted, professional, and verified service providers. Follow these requirements to join our marketplace.
          </p>
        </div>

        {/* Requirements List */}
        <div className="grid gap-6 mb-12">
          {requirements.map((req) => (
            <Card key={req.number} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold flex-shrink-0">
                    {req.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{req.title}</CardTitle>
                    <CardDescription className="mt-1">{req.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {req.items && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Required:</p>
                    <ul className="space-y-1">
                      {req.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

                {req.note && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">{req.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submission Instructions */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-6 w-6 text-primary" />
              Submit Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold mb-2">Ready to apply?</p>
              <p className="text-muted-foreground mb-4">
                Please compile all the required documents and information listed above, and send them to:
              </p>
              <div className="bg-white border-2 border-primary rounded-lg p-4 inline-block">
                <p className="text-xl font-bold text-primary">sservly@gmail.com</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold">In your email, please include:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Your full name and contact information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>The service category/categories you want to provide</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>All required documentation (as attachments or links)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>A brief description of your experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>⏱️ Processing Time:</strong> Our admin team reviews applications within 3-5 business days. Once approved, you can start listing your services and accepting bookings immediately!
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
              These requirements ensure Servly remains a safe, trusted, and professional marketplace — for both customers and businesses.
            </p>
            <p className="text-muted-foreground">
              We're here to help you grow, build your reputation, and connect with customers who value reliability and quality.
            </p>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button size="lg" onClick={() => window.location.href = "/auth/signup"}>
            Start Your Application
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
