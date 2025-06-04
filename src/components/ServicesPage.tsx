import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Search, Check, Shirt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
const ServicesPage = () => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const services = [{
    id: 1,
    name: 'Normal Clothes - Wash & Fold',
    price: '₹100/kg',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }, {
    id: 2,
    name: 'Normal Clothes - Wash & Steam Iron',
    price: '₹150/kg',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }, {
    id: 3,
    name: 'Bedsheets - Wash & Fold',
    price: '₹130/kg',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }, {
    id: 4,
    name: 'Quilts - Wash & Fold',
    price: '₹130/kg',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }, {
    id: 5,
    name: 'Curtains - Wash & Fold',
    price: '₹140/kg',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }, {
    id: 6,
    name: 'Shoes',
    price: '₹250/pair',
    color: 'from-blue-500 to-blue-600',
    icon: Shirt
  }];
  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]);
  };
  const calculateTotal = () => {
    return selectedServices.length * 100; // Assuming average ₹100 per service
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

    // Navigate with only serializable data (exclude icon property)
    navigate('/pickup-details', {
      state: {
        selectedServices: selectedServices.map(id => {
          const service = services.find(s => s.id === id)!;
          return {
            id: service.id,
            name: service.name,
            price: service.price,
            color: service.color
          };
        }),
        total
      }
    });
  };
  return <AppLayout>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-white/60" size={20} />
        <Input placeholder="Search services" className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {services.map(service => {
        const IconComponent = service.icon;
        const isSelected = selectedServices.includes(service.id);
        return <div key={service.id} onClick={() => handleServiceToggle(service.id)} className={`${isSelected ? 'bg-gradient-to-br from-blue-700 to-blue-800 ring-2 ring-blue-300' : `bg-gradient-to-br ${service.color}`} p-4 rounded-2xl text-white relative shadow-lg cursor-pointer transition-all duration-200 active:scale-95`}>
              <div className="absolute top-3 right-3">
                <div className={`w-6 h-6 ${isSelected ? 'bg-white' : 'bg-white/20'} rounded-full flex items-center justify-center transition-colors`}>
                  <Check size={14} className={isSelected ? 'text-blue-600' : 'text-white'} />
                </div>
              </div>
              <div className="mb-3">
                <IconComponent size={32} className="text-white opacity-90" />
              </div>
              <h3 className="text-sm font-medium mb-2 leading-tight">{service.name}</h3>
              <p className="text-lg font-bold">{service.price}</p>
            </div>;
      })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && <div className="glass-card p-4 mb-4">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">{selectedServices.length} services selected</span>
            
          </div>
        </div>}

      {/* Schedule Pickup Button */}
      <Button onClick={handleSchedulePickup} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-medium">
        Schedule Pickup
      </Button>
    </AppLayout>;
};
export default ServicesPage;