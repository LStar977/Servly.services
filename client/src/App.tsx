import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import RoleSelection from "@/pages/auth/role-selection";
import Search from "@/pages/search";
import ServiceSearch from "@/pages/service-search";
import Booking from "@/pages/booking";
import Profile from "@/pages/profile";
import CustomerDashboard from "@/pages/customer/dashboard";
import ProviderDashboard from "@/pages/provider/dashboard";
import ProviderServices from "@/pages/provider/services";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminVerification from "@/pages/admin/verification";
import Messages from "@/pages/messages";
import HowItWorks from "@/pages/how-it-works";
import ForBusiness from "@/pages/for-business";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Legal from "@/pages/legal";

function Router({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Auth - Only accessible when not authenticated */}
        {!isAuthenticated && (
          <>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/signup" component={Signup} />
          </>
        )}
        
        {/* Always accessible */}
        <Route path="/auth/role-selection" component={RoleSelection} />
        <Route path="/search" component={Search} />
        <Route path="/services" component={ServiceSearch} />
        <Route path="/booking" component={Booking} />
        <Route path="/profile" component={Profile} />
        <Route path="/messages" component={Messages} />
        
        {/* Informational Pages */}
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/for-business" component={ForBusiness} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/legal" component={Legal} />
        
        {/* Dashboards - Only for authenticated users */}
        {isAuthenticated && (
          <>
            <Route path="/customer/dashboard" component={CustomerDashboard} />
            <Route path="/provider/dashboard" component={ProviderDashboard} />
            <Route path="/provider/services" component={ProviderServices} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/verification" component={AdminVerification} />
          </>
        )}
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user", { credentials: "include" });
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
