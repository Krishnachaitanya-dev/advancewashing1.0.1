
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
const serviceColors = ['bg-blue-100', 'bg-indigo-100', 'bg-cyan-100', 'bg-sky-100', 'bg-teal-100', 'bg-slate-100'];
const iconColors = ['text-blue-600', 'text-indigo-600', 'text-cyan-600', 'text-sky-600', 'text-teal-600', 'text-slate-600'];

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
    }
  };

  const getServiceStyle = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % serviceColors.length;
      const bgClass = serviceColors[colorIndex];
      return `glass-card p-3 cursor-pointer transition-all duration-300 ${bgClass} border-2 border-blue-300 shadow-lg transform scale-105`;
    }
    return 'glass-card p-3 cursor-pointer transition-all duration-300 hover:bg-blue-50 border-2 border-transparent hover:scale-102';
  };

  const getIconColor = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % iconColors.length;
      return iconColors[colorIndex];
    }
    return 'text-blue-600';
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
          <div className="text-blue-600 text-lg">Loading services...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 pt-3 relative">
        <div className="absolute top-0 right-4 text-3xl opacity-10 animate-pulse">🧺✨</div>
        
        {/* Services Grid - compact with more rows for mobile */}
        <div className="grid grid-cols-2 gap-3">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon_name || 'Shirt'] || Shirt;
            const emojiDecorations = ['🧺', '👕', '🛏️', '✨', '🧽', '🧴'];
            
            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceSelect(service)} 
                className={`${getServiceStyle(service.id)} service-card relative`}
              >
                <div className="absolute top-1 right-1 text-lg opacity-20">
                  {emojiDecorations[index % emojiDecorations.length]}
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  {/* Service Icon - colored when selected */}
                  <div className="rounded-full p-2 bg-blue-50 transition-all duration-300 relative overflow-hidden">
                    {isServiceSelected(service.id) && (
                      <div className="absolute inset-0 flex items-center justify-center text-lg opacity-30">⭐</div>
                    )}
                    <IconComponent className={`w-6 h-6 transition-all duration-300 ${getIconColor(service.id)} relative z-10`} />
                  </div>
                  
                  {/* Service Name - smaller text */}
                  <h3 className="font-medium text-xs leading-tight text-blue-600">
                    {service.name}
                  </h3>
                  
                  {/* Service Price - smaller */}
                  <div className="font-medium text-sm text-blue-500">
                    💰 ₹{service.base_price_per_kg}/kg
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed premium-button relative overflow-hidden"
          >
            <span className="relative z-10">
              🚛 Schedule Pickup {selectedServices.length > 0 && `(${selectedServices.length}) 📦`}
            </span>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
});

ServicesPage.displayName = 'ServicesPage';
export default ServicesPage;
