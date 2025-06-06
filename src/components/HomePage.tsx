import React, { useEffect } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Shirt, Clock, Award, Sparkles, ChevronRight, Package, Bed, Star, Layers, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useAndroidBackButton } from '@/hooks/useAndroidBackButton';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const {
    services,
    loading: servicesLoading
  } = useServices();
  const {
    orders,
    loading: ordersLoading
  } = useOrders();
  const {
    user
  } = useAuth();
  const { toast } = useToast();

  // Handle Android back button
  useAndroidBackButton();

  // Show welcome notification when component loads
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
          type: "success"
        });
      }, 500);
    }
  }, [user, toast]);

  // Function to get appropriate icon for each service
  const getServiceIcon = (serviceName: string, index: number) => {
    const lowerName = serviceName.toLowerCase();

    // Map service types to specific icons
    if (lowerName.includes('normal') && lowerName.includes('wash') && lowerName.includes('fold')) {
      return <Shirt className="w-6 h-6" />;
    }
    if (lowerName.includes('steam') || lowerName.includes('iron')) {
      return <Zap className="w-6 h-6" />;
    }
    if (lowerName.includes('bedsheet') || lowerName.includes('bed')) {
      return <Bed className="w-6 h-6" />;
    }
    if (lowerName.includes('quilt')) {
      return <Layers className="w-6 h-6" />;
    }
    if (lowerName.includes('premium')) {
      return <Star className="w-6 h-6" />;
    }
    if (lowerName.includes('wash') && lowerName.includes('fold') && !lowerName.includes('normal')) {
      return <Package className="w-6 h-6" />;
    }

    // Default fallback icons based on index
    const defaultIcons = [<Shirt className="w-6 h-6" />, <Sparkles className="w-6 h-6" />, <Bed className="w-6 h-6" />, <Shield className="w-6 h-6" />];
    return defaultIcons[index % defaultIcons.length];
  };

  // Get featured services (first 4)
  const featuredServices = services.slice(0, 4).map((service, index) => ({
    id: service.id,
    name: service.name,
    icon: getServiceIcon(service.name, index),
    description: service.description || ''
  }));

  // Get active orders (not delivered or cancelled)
  const activeOrders = orders.filter(order => !['delivered', 'cancelled'].includes(order.status));
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/60';
      case 'confirmed':
        return 'bg-blue-600/60';
      case 'picked_up':
        return 'bg-purple-600/60';
      case 'in_process':
        return 'bg-orange-600/60';
      case 'ready_for_delivery':
        return 'bg-green-600/60';
      default:
        return 'bg-gray-600/60';
    }
  };
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'in_process':
        return 'In Process';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      default:
        return status;
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Hero Section - Compact */}
        <div className="glass-card p-4">
          <h2 className="text-lg font-bold text-white mb-2">
            Welcome to Advance Washing
          </h2>
          <p className="text-white/80 mb-4 text-sm leading-relaxed">
            Professional laundry service at your doorstep
          </p>
          <Link to="/services">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold w-full sm:w-auto px-6 py-2 text-sm">
              Schedule Pickup
            </Button>
          </Link>
        </div>

        {/* Services Preview - Compact */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white">Popular Services</h3>
            <Link to="/services">
              <Button variant="ghost" className="text-white flex items-center p-0 text-xs px-2">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          
          {servicesLoading ? (
            <div className="text-white/80 text-center py-4 text-sm">Loading services...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {featuredServices.map((service) => (
                <div key={service.id} className="glass-card p-3 flex flex-col items-center text-center">
                  <div className="rounded-full p-2 mb-2 bg-slate-100">
                    {service.icon}
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">
                    {service.name}
                  </h4>
                  <p className="text-white/70 text-xs line-clamp-2">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Status - Compact */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-bold text-white mb-3">Active Orders</h3>
          
          {ordersLoading ? (
            <div className="text-white/80 text-center py-3 text-sm">Loading orders...</div>
          ) : activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {order.order_number}
                    </p>
                    <p className="text-white/70 text-xs">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                    </p>
                  </div>
                  <div className={`${getStatusColor(order.status)} text-white text-xs font-medium px-2 py-1 rounded`}>
                    {formatStatus(order.status)}
                  </div>
                </div>
              ))}
              <Link to="/orders">
                <Button variant="outline" className="w-full border-white/20 text-xs py-2 bg-blue-900 hover:bg-blue-800 text-white">
                  View All Orders
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/80 mb-4 text-sm">No active orders</p>
              <Link to="/services">
                <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 text-sm">
                  Create Your First Order
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
