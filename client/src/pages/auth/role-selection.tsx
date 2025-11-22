import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RoleSelection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    setLocation("/auth/signup");
    return null;
  }

  const handleSelectRole = async (role: "customer" | "provider") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error("Failed to update role");
      
      toast({
        title: "Welcome!",
        description: role === "provider" ? "Let's set up your business" : "Ready to find services",
      });

      if (role === "provider") {
        setLocation("/provider/dashboard");
      } else {
        setLocation("/customer/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update your role",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-card/50 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome to Servly!</CardTitle>
          <CardDescription className="text-center">
            What would you like to do?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => handleSelectRole("customer")}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <span className="text-4xl mb-3">👤</span>
                  <span className="text-lg font-semibold">Book Services</span>
                  <span className="text-sm text-muted-foreground mt-1">Find trusted professionals</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center hover:bg-accent"
              onClick={() => handleSelectRole("provider")}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <span className="text-4xl mb-3">💼</span>
                  <span className="text-lg font-semibold">Offer Services</span>
                  <span className="text-sm text-muted-foreground mt-1">Grow your business</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
