
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Package } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Background water effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="water-wave"></div>
        <div className="water-wave water-wave-2"></div>
      </div>
      
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-blue-900/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
              alt="AW Logo" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-white text-xl font-semibold">Advance Washing</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-blue-900/60 backdrop-blur-md border-t border-white/10">
          <div className="flex justify-around">
            <Link 
              to="/" 
              className={`p-4 flex flex-col items-center ${isActive('/') ? 'text-white' : 'text-white/70'}`}
            >
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link 
              to="/services" 
              className={`p-4 flex flex-col items-center ${isActive('/services') ? 'text-white' : 'text-white/70'}`}
            >
              <ShoppingBag size={24} />
              <span className="text-xs mt-1">Services</span>
            </Link>
            <Link 
              to="/orders" 
              className={`p-4 flex flex-col items-center ${isActive('/orders') ? 'text-white' : 'text-white/70'}`}
            >
              <Package size={24} />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link 
              to="/profile" 
              className={`p-4 flex flex-col items-center ${isActive('/profile') ? 'text-white' : 'text-white/70'}`}
            >
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
