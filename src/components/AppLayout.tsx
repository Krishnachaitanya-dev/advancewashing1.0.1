

import React, { ReactNode, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Package } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = memo(({ children }: AppLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header - premium glass effect */}
        <header className="p-4 flex items-center justify-between glass-card mx-4 mt-4 safe-area-top py-[8px] px-[60px]">
          <div className="flex items-center">
            <img src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" alt="AW Logo" className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3" loading="lazy" />
            <h1 className="text-white text-lg sm:text-xl font-semibold">Advance Washing</h1>
          </div>
        </header>

        {/* Main content - optimized scrolling */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation - premium glass effect */}
        <nav className="fixed bottom-4 left-4 right-4 glass-card safe-area-bottom rounded-2xl">
          <div className="flex justify-around max-w-md mx-auto">
            <Link to="/" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <Home size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/services" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/services') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Services</span>
            </Link>
            <Link to="/orders" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/orders') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <Package size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link to="/profile" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/profile') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <User size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';
export default AppLayout;

