
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthWrapper from "@/components/AuthWrapper";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotificationSettings from "./pages/NotificationSettings";
import PaymentMethods from "./pages/PaymentMethods";
import PersonalInformation from "./pages/PersonalInformation";
import AddressManagement from "./pages/AddressManagement";
import RateApp from "./pages/RateApp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PickupDetails from "./pages/PickupDetails";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <AuthWrapper>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notification-settings" element={<NotificationSettings />} />
                    <Route path="/payment-methods" element={<PaymentMethods />} />
                    <Route path="/personal-information" element={<PersonalInformation />} />
                    <Route path="/address-management" element={<AddressManagement />} />
                    <Route path="/rate-app" element={<RateApp />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/pickup-details" element={<PickupDetails />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
