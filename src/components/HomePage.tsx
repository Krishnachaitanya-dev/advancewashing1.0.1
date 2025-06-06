import React from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Shirt, Clock, Award, Sparkles, ChevronRight, Package, Bed, Star, Layers, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useAndroidBackButton } from '@/hooks/useAndroidBackButton';

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

  // Handle Android back button
  useAndroidBackButton();

  // Function to get appropriate icon for each service
  const getServiceIcon = (serviceName: string, index: number) => {
    const lowerName = serviceName.toLowerCase();

    // Map service types to specific icons
    if (lowerName.includes('normal') && lowerName.includes('wash') && lowerName.includes('fold')) {
      return <Shirt className="w-5 h-5" />;
    }
    if (lowerName.includes('steam') || lowerName.includes('iron')) {
      return <Zap className="w-5 h-5" />;
    }
    if (lowerName.includes('bedsheet') || lowerName.includes('bed')) {
      return <Bed className="w-5 h-5" />;
    }
    if (lowerName.includes('quilt')) {
      return <Layers className="w-5 h-5" />;
    }
    if (lowerName.includes('premium')) {
      return <Star className="w-5 h-5" />;
    }
    if (lowerName.includes('wash') && lowerName.includes('fold') && !lowerName.includes('normal')) {
      return <Package className="w-5 h-5" />;
    }

    // Default fallback icons based on index
    const defaultIcons = [<Shirt className="w-5 h-5" />, <Sparkles className="w-5 h-5" />, <Bed className="w-5 h-5" />, <Shield className="w-5 h-5" />];
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
      <div className="space-y-3">
        {/* Hero Section - More Compact */}
        <div className="glass-card p-3">
          <h2 className="text-base font-bold text-white mb-1">
            Welcome to Advance Washing
          </h2>
          <p className="text-white/80 mb-3 text-xs leading-relaxed">
            Professional laundry service at your doorstep
          </p>
          <Link to="/services">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold w-full px-4 py-1.5 text-xs">
              Schedule Pickup
            </Button>
          </Link>
        </div>

        {/* Services Preview - More Compact */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold text-white">Popular Services</h3>
            <Link to="/services">
              <Button variant="ghost" className="text-white flex items-center p-0 text-xs px-1">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          
          {servicesLoading ? (
            <div className="text-white/80 text-center py-2 text-xs">Loading services...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {featuredServices.map((service) => (
                <div key={service.id} className="glass-card p-2 flex flex-col items-center text-center">
                  <div className="rounded-full p-1.5 mb-1 bg-slate-100">
                    {service.icon}
                  </div>
                  <h4 className="text-white font-medium text-xs mb-0.5 leading-tight">
                    {service.name}
                  </h4>
                  <p className="text-white/70 text-xs line-clamp-1">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Status - More Compact */}
        <div className="glass-card p-3">
          <h3 className="text-base font-bold text-white mb-2">Active Orders</h3>
          
          {ordersLoading ? (
            <div className="text-white/80 text-center py-2 text-xs">Loading orders...</div>
          ) : activeOrders.length > 0 ? (
            <div className="space-y-2">
              {activeOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium text-xs">
                      {order.order_number}
                    </p>
                    <p className="text-white/70 text-xs">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                    </p>
                  </div>
                  <div className={`${getStatusColor(order.status)} text-white text-xs font-medium px-2 py-0.5 rounded`}>
                    {formatStatus(order.status)}
                  </div>
                </div>
              ))}
              <Link to="/orders">
                <Button variant="outline" className="w-full border-white/20 text-xs py-1.5 bg-blue-900 hover:bg-blue-800 text-white">
                  View All Orders
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-white/80 mb-3 text-xs">No active orders</p>
              <Link to="/services">
                <Button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 text-xs">
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
