import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import Search from "@/pages/search";
import Booking from "@/pages/booking";
import CustomerDashboard from "@/pages/customer/dashboard";
import ProviderDashboard from "@/pages/provider/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Auth */}
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        
        {/* Main Flows */}
        <Route path="/search" component={Search} />
        <Route path="/booking" component={Booking} />
        
        {/* Dashboards */}
        <Route path="/customer/dashboard" component={CustomerDashboard} />
        <Route path="/provider/dashboard" component={ProviderDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        
        {/* Static pages fallbacks */}
        <Route path="/for-business">
           {/* Redirect or show simple content */}
           <div className="container mx-auto py-20 text-center">
             <h1 className="text-4xl font-bold mb-4">Grow your business with Servly</h1>
             <p className="mb-8 text-lg text-muted-foreground">Join thousands of professionals finding new customers every day.</p>
             <a href="/auth/signup?role=provider" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
               Get Started Today
             </a>
           </div>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
