
import React, { memo } from 'react';
import AppLayout from './AppLayout';
import { useServices } from '@/hooks/useServices';
import { 
  Shirt, 
  Clock, 
  Award, 
  Sparkles, 
  Zap,
  Bed,
  Shield,
  Package,
  Footprints
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Shirt': Shirt,
  'Clock': Clock,
  'Award': Award,
  'Sparkles': Sparkles,
  'Zap': Zap,
  'Bed': Bed,
  'Shield': Shield,
  'Package': Package,
  'Footprints': Footprints
};

const ServicesPage = memo(() => {
  const { services, loading } = useServices();

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
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Our Services</h2>
          <p className="text-white/80">Choose from our range of professional laundry services</p>
        </div>

        <div className="grid gap-4">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name || 'Shirt'] || Shirt;
            
            return (
              <div key={service.id} className="glass-card p-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-3 bg-blue-900/60">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{service.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 font-medium">
                        ₹{service.base_price_per_kg}/kg
                      </span>
                      <button className="bg-blue-900/60 hover:bg-blue-800/60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
});

ServicesPage.displayName = 'ServicesPage';
export default ServicesPage;
