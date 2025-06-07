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
      <div className="space-y-4">
        {/* Hero Section */}
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-2xl opacity-20">🧺✨</div>
          <h2 className="text-lg font-bold text-blue-600 mb-2">
            Welcome to Advance Washing
          </h2>
          <p className="text-blue-500 mb-4 text-sm">
            Professional laundry service at your doorstep 🚛💙
          </p>
          <Link to="/services">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full premium-button">
              Schedule Pickup 📅
            </Button>
          </Link>
        </div>

        {/* Services Preview */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-blue-600">Popular Services ⭐</h3>
            <Link to="/services">
              <Button variant="ghost" className="text-blue-500 flex items-center p-0 text-sm hover:text-blue-600">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {servicesLoading ? (
            <div className="text-blue-600 text-center py-4">Loading services... ⏳</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {featuredServices.map((service, index) => (
                <div key={service.id} className="glass-card p-3 flex flex-col items-center text-center service-card">
                  <div className="rounded-full p-2 mb-2 bg-blue-50">
                    {service.icon}
                  </div>
                  <h4 className="text-blue-600 font-medium text-sm mb-1">
                    {service.name}
                  </h4>
                  <p className="text-blue-500 text-xs line-clamp-2">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-2xl opacity-20">📦🔄</div>
          <h3 className="text-lg font-bold text-blue-600 mb-3">Active Orders 📋</h3>
          
          {ordersLoading ? (
            <div className="text-blue-600 text-center py-4">Loading orders... ⏳</div>
          ) : activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg my-[2px] relative overflow-hidden">
                  <div className="absolute top-1 right-1 opacity-10 text-lg">🧾</div>
                  <div>
                    <p className="text-blue-600 font-medium text-sm">
                      {order.order_number}
                    </p>
                    <p className="text-blue-500 text-xs">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items 👕
                    </p>
                  </div>
                  <div className={`${getStatusColor(order.status)} text-white text-xs font-medium px-3 py-1 rounded-full ${order.status.replace('_', '-')}`}>
                    {formatStatus(order.status)}
                  </div>
                </div>
              ))}
              <Link to="/orders">
                <Button variant="outline" className="w-full border-blue-300 bg-blue-600 hover:bg-blue-700 text-white py-0 my-[5px] premium-button">
                  View All Orders 📋
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6 relative">
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-5">🧺</div>
              <p className="text-blue-500 mb-4">No active orders 📭</p>
              <Link to="/services">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white premium-button">
                  Create Your First Order 🎯
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
