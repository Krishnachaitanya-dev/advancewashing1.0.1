
import React, { useState, memo } from 'react';
import AppLayout from './AppLayout';
import { useServices } from '@/hooks/useServices';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Shirt, 
  Zap,
  Bed,
  Shield,
  Package,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Shirt': Shirt,
  'Zap': Zap,
  'Bed': Bed,
  'Shield': Shield,
  'Package': Package,
  'shoes': ShoppingBag
};

// Define color scheme for selected services with stronger colors
const serviceColors = [
  'border-green-400',
  'border-pink-400', 
  'border-violet-400',
  'border-orange-400',
  'border-yellow-400',
  'border-cyan-400'
];

const serviceBgColors = [
  'bg-green-400/30',
  'bg-pink-400/30', 
  'bg-violet-400/30',
  'bg-orange-400/30',
  'bg-yellow-400/30',
  'bg-cyan-400/30'
];

const serviceCheckColors = [
  'text-green-400',
  'text-pink-400', 
  'text-violet-400',
  'text-orange-400',
  'text-yellow-400',
  'text-cyan-400'
];

interface SelectedService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
}

const ServicesPage = memo(() => {
  const { services, loading } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('Current selected services:', selectedServices);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceSelect = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    
    if (isSelected) {
      // Remove service
      const newSelectedServices = selectedServices.filter(s => s.id !== service.id);
      setSelectedServices(newSelectedServices);
      console.log('Service removed, new list:', newSelectedServices);
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
      console.log('Service added, new list:', newSelectedServices);
    }
  };

  const getServiceStyle = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % serviceColors.length;
      const borderClass = serviceColors[colorIndex];
      const bgClass = serviceBgColors[colorIndex];
      console.log(`Service ${serviceId} at index ${selectedIndex} gets border ${borderClass}`);
      return `glass-card p-4 cursor-pointer transition-all duration-300 border-4 ${borderClass} ${bgClass} relative shadow-lg transform scale-105`;
    }
    return 'glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:scale-102';
  };

  const getCheckmarkColor = (serviceId: string) => {
    const selectedIndex = selectedServices.findIndex(s => s.id === serviceId);
    if (selectedIndex !== -1) {
      const colorIndex = selectedIndex % serviceCheckColors.length;
      return serviceCheckColors[colorIndex];
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
        variant: "destructive",
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
          color: serviceColors[index % serviceColors.length]
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
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="glass-card p-4">
          <h2 className="text-2xl font-bold text-white mb-4">Advance Washing</h2>
          <Input
            type="text"
            placeholder="Search services"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon_name || 'Shirt'] || Shirt;
            const isSelected = isServiceSelected(service.id);
            
            return (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={getServiceStyle(service.id)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-white rounded-full p-1 shadow-lg">
                      <CheckCircle2 
                        className={`w-6 h-6 ${getCheckmarkColor(service.id)} fill-current`} 
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Service Icon */}
                  <div className={`rounded-full p-3 ${isSelected ? 'bg-white/40' : 'bg-white/20'} transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Service Name */}
                  <h3 className={`font-semibold text-sm leading-tight transition-all duration-300 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                    {service.name}
                  </h3>
                  
                  {/* Service Price */}
                  <div className={`font-medium text-lg transition-all duration-300 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                    ₹{service.base_price_per_kg}/kg
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Pickup Button */}
        <div className="pb-6">
          <Button
            onClick={handleSchedulePickup}
            disabled={selectedServices.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Pickup
          </Button>
        </div>
      </div>
    </AppLayout>
  );
});

ServicesPage.displayName = 'ServicesPage';
export default ServicesPage;
