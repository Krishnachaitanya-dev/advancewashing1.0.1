
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const ServicesPage = lazy(() => import("./pages/Services"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const PickupDetailsPage = lazy(() => import("./pages/PickupDetails"));
const AddressManagementPage = lazy(() => import("./pages/AddressManagement"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Optimize query client for mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      retry: 1, // Reduce retries for mobile
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst', // Better offline handling
    },
  },
});

// Optimized loading component for mobile
const LoadingSpinner = () => (
  <div className="min-h-screen bg-blue-600 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

// Route Guard Component
const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Add mobile-specific initialization
    if (typeof window !== 'undefined') {
      // Prevent zoom on mobile
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteGuard>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/addresses" element={<AddressManagementPage />} />
              <Route path="/pickup-details" element={<PickupDetailsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
