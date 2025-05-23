
import React from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ServicesPage = () => {
  const serviceCategories = [
    {
      id: "regular",
      name: "Regular",
      services: [
        {
          id: 1,
          name: 'Regular Wash',
          price: '$5.99',
          description: 'Per kg, includes washing, drying, and folding',
        },
        {
          id: 2,
          name: 'Ironing Service',
          price: '$3.99',
          description: 'Per item, professional ironing service',
        },
        {
          id: 3,
          name: 'Wash & Iron',
          price: '$8.99',
          description: 'Per kg, complete wash and iron service',
        }
      ]
    },
    {
      id: "premium",
      name: "Premium",
      services: [
        {
          id: 4,
          name: 'Delicate Wash',
          price: '$9.99',
          description: 'For silk, wool and other delicate fabrics',
        },
        {
          id: 5,
          name: 'Dry Cleaning',
          price: '$12.99',
          description: 'Per item, professional dry cleaning',
        }
      ]
    },
    {
      id: "express",
      name: "Express",
      services: [
        {
          id: 6,
          name: '3-Hour Express',
          price: '$15.99',
          description: 'Per kg, ready in 3 hours',
        },
        {
          id: 7,
          name: 'Same Day Delivery',
          price: '$10.99',
          description: 'Per kg, delivery on the same day',
        }
      ]
    }
  ];

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

      {/* Services Tabs */}
      <Tabs defaultValue="regular" className="mb-6">
        <TabsList className="bg-white/10 backdrop-blur-sm w-full flex justify-between mb-6">
          {serviceCategories.map(category => (
            <TabsTrigger 
              key={category.id}
              value={category.id}
              className="flex-1 data-[state=active]:bg-blue-900/60 text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {serviceCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-4">
              {category.services.map(service => (
                <div key={service.id} className="glass-card p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">{service.name}</h3>
                    <span className="text-white font-bold">{service.price}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{service.description}</p>
                  <Button className="bg-blue-900 hover:bg-blue-800 text-white w-full">
                    Add to Order
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
};

export default ServicesPage;
