
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
  ShoppingBag
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Shirt': Shirt,
  'Zap': Zap,
  'Bed': Bed,
  'Shield': Shield,
  'Package': Package,
  'shoes': ShoppingBag
};

// Define color scheme for selected services
const serviceColors = [
  'bg-green-500',
  'bg-pink-500', 
  'bg-violet-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-cyan-500'
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
      const colorClass = serviceColors[colorIndex];
      console.log(`Service ${serviceId} at index ${selectedIndex} gets color ${colorClass}`);
      return `glass-card p-4 cursor-pointer transition-all duration-200 ${colorClass}`;
    }
    return 'glass-card p-4 cursor-pointer transition-all duration-200 hover:bg-white/10';
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
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Service Icon */}
                  <div className="rounded-full p-3 bg-white/20">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Service Name */}
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {service.name}
                  </h3>
                  
                  {/* Service Price */}
                  <div className="text-white/90 font-medium text-lg">
                    ₹{service.base_price_per_kg}/kg
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold mb-3">Selected Services</h3>
            <div className="space-y-2 mb-4">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center text-sm">
                  <span className="text-white/90">{service.name}</span>
                  <span className="text-white font-medium">₹{service.price}/kg</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Estimated Total:</span>
                <span className="text-white font-bold text-lg">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>
        )}

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
