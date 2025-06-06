import React, { useState, memo } from 'react';
import AppLayout from './AppLayout';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shirt, Zap, Bed, Shield, Package, ShoppingBag } from 'lucide-react';

const iconMap: {
  [key: string]: React.ComponentType<any>;
} = {
  'Shirt': Shirt,
  'Zap': Zap,
  'Bed': Bed,
  'Shield': Shield,
  'Package': Package,
  'shoes': ShoppingBag
};

// Define color scheme for selected services
const serviceColors = ['bg-green-400/30', 'bg-pink-400/30', 'bg-violet-400/30', 'bg-orange-400/30', 'bg-yellow-400/30', 'bg-cyan-400/30'];
const iconColors = ['text-green-400', 'text-pink-400', 'text-violet-400', 'text-orange-400', 'text-yellow-400', 'text-cyan-400'];

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

const ServicesPage = memo(() => {
  const { services, loading } = useServices();
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleServiceSelect = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    
    if (isSelected) {
      // Remove service
      const newSelectedServices = selectedServices.filter(s => s.id !== service.id);
      setSelectedServices(newSelectedServices);
      
      // Show deselection notification
      toast({
        title: "Service removed",
        description: `${service.name} has been removed`
      });
    } else {
      // Add service with default values
      const newService: SelectedService = {
        id: service.id,
        name: service.name,
        price: service.base_price_per_kg,
        quantity: 1,
        weight: 1
      };
      const newSelectedServices = [...selectedServices, newService];
      setSelectedServices(newSelectedServices);
      
      // Show selection notification
      toast({
        title: "Service added",
        description: `${service.name} has been added to your order`
      });
    }
  };

  const getServiceStyle = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % serviceColors.length;
      const bgClass = serviceColors[colorIndex];
      return `glass-card p-3 cursor-pointer transition-all duration-300 ${bgClass} border-2 border-white/30 shadow-lg transform scale-105`;
    }
    return 'glass-card p-3 cursor-pointer transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:scale-102';
  };

  const getIconColor = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % iconColors.length;
      return iconColors[colorIndex];
    }
    return 'text-white';
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (service.price * service.weight * service.quantity);
    }, 0);
  };

  const handleSchedulePickup = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to proceed.",
        variant: "destructive"
      });
      return;
    }

    const total = calculateTotal();

    // Show confirmation notification
    toast({
      title: "Order started!",
      description: `Proceeding with ${selectedServices.length} services`
    });

    // Navigate to pickup details with selected services
    navigate('/pickup-details', {
      state: {
        selectedServices: selectedServices.map((service, index) => ({
          id: service.id,
          name: service.name,
          price: `₹${service.price}/kg`,
          color: iconColors[index % iconColors.length]
        })),
        total: total
      }
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-white text-lg">Loading services...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 pt-3">
        {/* Services Grid - compact with more rows for mobile */}
        <div className="grid grid-cols-2 gap-3">
          {services.map(service => {
            const IconComponent = iconMap[service.icon_name || 'Shirt'] || Shirt;
            
            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceSelect(service)} 
                className={getServiceStyle(service.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {/* Service Icon - colored when selected */}
                  <div className="rounded-full p-2 bg-white/20 transition-all duration-300">
                    <IconComponent className={`w-6 h-6 transition-all duration-300 ${getIconColor(service.id)}`} />
                  </div>
                  
                  {/* Service Name - smaller text */}
                  <h3 className="font-medium text-xs leading-tight text-white/90">
                    {service.name}
                  </h3>
                  
                  {/* Service Price - smaller */}
                  <div className="font-medium text-sm text-white/90">
                    ₹{service.base_price_per_kg}/kg
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Pickup Button */}
        <div className="pb-4 pt-2">
          <Button 
            onClick={handleSchedulePickup} 
            disabled={selectedServices.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Pickup {selectedServices.length > 0 && `(${selectedServices.length})`}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
});

ServicesPage.displayName = 'ServicesPage';
export default ServicesPage;
