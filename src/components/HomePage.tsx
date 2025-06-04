import React from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Shirt, Clock, Award, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const HomePage = () => {
  const services = [{
    id: 1,
    name: 'Regular Wash',
    icon: <Shirt className="w-6 h-6" />,
    description: 'Standard washing service for your clothes'
  }, {
    id: 2,
    name: 'Express Service',
    icon: <Clock className="w-6 h-6" />,
    description: 'Get your clothes cleaned in just 3 hours'
  }, {
    id: 3,
    name: 'Premium Care',
    icon: <Award className="w-6 h-6" />,
    description: 'Special care for your delicate fabrics'
  }, {
    id: 4,
    name: 'Dry Cleaning',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Professional dry cleaning service'
  }];
  return <AppLayout>
      {/* Hero Section */}
      <div className="glass-card p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to Advance Washing</h2>
        <p className="text-white/80 mb-4 text-sm sm:text-base">Professional laundry service at your doorstep</p>
        <Link to="/services">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold w-full sm:w-auto">
            Schedule Pickup
          </Button>
        </Link>
      </div>

      {/* Services Preview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Popular Services</h3>
          <Link to="/services">
            <Button variant="ghost" className="text-white flex items-center p-0 text-sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {services.map(service => <div key={service.id} className="glass-card p-3 sm:p-4 flex flex-col items-center">
              <div className="rounded-full p-2 sm:p-3 mb-2 bg-slate-100">
                {service.icon}
              </div>
              <h4 className="text-white font-medium text-sm sm:text-base text-center">{service.name}</h4>
              <p className="text-white/70 text-xs text-center mt-1">{service.description}</p>
            </div>)}
        </div>
      </div>

      {/* Current Status */}
      <div className="glass-card p-4">
        <h3 className="text-lg font-bold text-white mb-2">Active Orders</h3>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg mb-3">
          <div>
            <p className="text-white font-medium text-sm sm:text-base">#AW2023154</p>
            <p className="text-white/70 text-xs sm:text-sm">Regular Wash · 5 items</p>
          </div>
          <div className="bg-blue-900/60 text-white text-xs font-medium px-2 py-1 rounded">
            In Progress
          </div>
        </div>
        <Link to="/orders">
          <Button variant="outline" className="w-full border-white/20 text-sm text-zinc-800 bg-sky-500 hover:bg-sky-400">
            Track Order
          </Button>
        </Link>
      </div>
    </AppLayout>;
};
export default HomePage;