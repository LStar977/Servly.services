import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";

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
import HowItWorks from "@/pages/how-it-works";
import ForBusiness from "@/pages/for-business";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Legal from "@/pages/legal";

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Switch>
          <Route path="/" element={<Home />} />
          
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/role-selection" element={<RoleSelection />} />
          
          {/* Main Flows */}
          <Route path="/search" element={<Search />} />
          <Route path="/services" element={<ServiceSearch />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Info Pages */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-business" element={<ForBusiness />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          
          {/* Dashboards */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Switch>
      </Layout>
    </AuthProvider>
  );
}
