
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const ServicesPage = lazy(() => import("./pages/Services"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const PickupDetailsPage = lazy(() => import("./pages/PickupDetails"));
const AddressManagementPage = lazy(() => import("./pages/AddressManagement"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Optimize query client for mobile with longer cache times
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer for mobile
      gcTime: 30 * 60 * 1000, // 30 minutes - longer cache retention
      retry: 2, // More retries for mobile network issues
      refetchOnWindowFocus: false, // Disable for mobile
      refetchOnReconnect: true, // Keep for mobile connectivity
    },
  },
});

// Optimized loading component for mobile
const LoadingSpinner = () => (
  <div className="min-h-screen bg-blue-600 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/addresses" element={<AddressManagementPage />} />
            <Route path="/pickup-details" element={<PickupDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
