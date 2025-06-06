
import React, { ReactNode, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Package } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = memo(({
  children
}: AppLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header - centered logo and company name */}
        <header className="p-3 flex items-center justify-center glass-card mx-3 mt-3 safe-area-top py-2 px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
              alt="AW Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 mr-2" 
              loading="lazy" 
            />
            <h1 className="text-white text-base sm:text-lg font-semibold">Advance Washing</h1>
          </div>
        </header>

        {/* Main content - added top margin for spacing */}
        <main className="flex-1 p-3 pb-16 overflow-y-auto py-0 px-[25px] mt-4">
          {children}
        </main>

        {/* Bottom Navigation - more compact */}
        <nav className="fixed bottom-2 left-2 right-2 glass-card safe-area-bottom rounded-xl">
          <div className="flex justify-around max-w-md mx-auto">
            <Link 
              to="/" 
              className={`p-2 sm:p-3 flex flex-col items-center min-h-[50px] ${
                isActive('/') ? 'text-blue-300' : 'text-white/70'
              } transition-all duration-300 active:scale-95 hover:text-blue-200`}
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link 
              to="/services" 
              className={`p-2 sm:p-3 flex flex-col items-center min-h-[50px] ${
                isActive('/services') ? 'text-blue-300' : 'text-white/70'
              } transition-all duration-300 active:scale-95 hover:text-blue-200`}
            >
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs mt-1">Services</span>
            </Link>
            <Link 
              to="/orders" 
              className={`p-2 sm:p-3 flex flex-col items-center min-h-[50px] ${
                isActive('/orders') ? 'text-blue-300' : 'text-white/70'
              } transition-all duration-300 active:scale-95 hover:text-blue-200`}
            >
              <Package size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link 
              to="/profile" 
              className={`p-2 sm:p-3 flex flex-col items-center min-h-[50px] ${
                isActive('/profile') ? 'text-blue-300' : 'text-white/70'
              } transition-all duration-300 active:scale-95 hover:text-blue-200`}
            >
              <User size={18} className="sm:w-5 sm:h-5" />
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
