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
import Profile from "@/pages/profile";
import CustomerDashboard from "@/pages/customer/dashboard";
import ProviderDashboard from "@/pages/provider/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import HowItWorks from "@/pages/how-it-works";
import ForBusiness from "@/pages/for-business";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Legal from "@/pages/legal";

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
        <Route path="/profile" component={Profile} />
        
        {/* Informational Pages */}
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/for-business" component={ForBusiness} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/legal" component={Legal} />
        
        {/* Dashboards */}
        <Route path="/customer/dashboard" component={CustomerDashboard} />
        <Route path="/provider/dashboard" component={ProviderDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        
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
