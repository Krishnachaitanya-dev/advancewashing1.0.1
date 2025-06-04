
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Search, Check, Shirt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ServiceSelectionModal from './ServiceSelectionModal';

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const services = [
    {
      id: 1,
      name: 'Normal Clothes - Wash & Fold',
      price: '₹100/kg',
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      icon: Shirt,
    },
    {
      id: 2,
      name: 'Normal Clothes - Wash & Steam Iron',
      price: '₹150/kg',
      color: 'bg-gradient-to-br from-pink-400 to-pink-500',
      icon: Shirt,
    },
    {
      id: 3,
      name: 'Bedsheets - Wash & Fold',
      price: '₹130/kg',
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      icon: Shirt,
    },
    {
      id: 4,
      name: 'Quilts - Wash & Fold',
      price: '₹130/kg',
      color: 'bg-gradient-to-br from-purple-400 to-purple-500',
      icon: Shirt,
    },
    {
      id: 5,
      name: 'Curtains - Wash & Fold',
      price: '₹140/kg',
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      icon: Shirt,
    },
    {
      id: 6,
      name: 'Shoes',
      price: '₹250/pair',
      color: 'bg-gradient-to-br from-pink-400 to-pink-500',
      icon: Shirt,
    }
  ];

  const handleSchedulePickup = () => {
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-white/60" size={20} />
        <Input 
          placeholder="Search services" 
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm rounded-xl"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {services.map(service => {
          const IconComponent = service.icon;
          return (
            <div key={service.id} className={`${service.color} p-4 rounded-2xl text-white relative shadow-lg`}>
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              </div>
              <div className="mb-3">
                <IconComponent size={32} className="text-white opacity-90" />
              </div>
              <h3 className="text-sm font-medium mb-2 leading-tight">{service.name}</h3>
              <p className="text-lg font-bold">{service.price}</p>
            </div>
          );
        })}
      </div>

      {/* Schedule Pickup Button */}
      <Button 
        onClick={handleSchedulePickup}
        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-medium"
      >
        Schedule Pickup
      </Button>

      <ServiceSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
      />
    </AppLayout>
  );
};

export default ServicesPage;
