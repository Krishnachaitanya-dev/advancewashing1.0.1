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
  return <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Background water effect - optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="water-wave"></div>
        <div className="water-wave water-wave-2"></div>
      </div>
      
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header - optimized for mobile touch */}
        <header className="p-4 flex items-center justify-between bg-blue-900/30 backdrop-blur-sm border-b border-white/10 safe-area-top px-[70px] py-[5px]">
          <div className="flex items-center">
            <img src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" alt="AW Logo" className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3" loading="lazy" />
            <h1 className="text-white text-lg sm:text-xl font-semibold">Advance Washing</h1>
          </div>
        </header>

        {/* Main content - optimized scrolling */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation - optimized for mobile touch */}
        <nav className="fixed bottom-0 left-0 right-0 bg-blue-900/80 backdrop-blur-md border-t border-white/10 safe-area-bottom">
          <div className="flex justify-around max-w-md mx-auto">
            <Link to="/" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/') ? 'text-white' : 'text-white/70'} transition-colors active:scale-95`}>
              <Home size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link to="/services" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/services') ? 'text-white' : 'text-white/70'} transition-colors active:scale-95`}>
              <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Services</span>
            </Link>
            <Link to="/orders" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/orders') ? 'text-white' : 'text-white/70'} transition-colors active:scale-95`}>
              <Package size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            <Link to="/profile" className={`p-3 sm:p-4 flex flex-col items-center min-h-[60px] ${isActive('/profile') ? 'text-white' : 'text-white/70'} transition-colors active:scale-95`}>
              <User size={20} className="sm:w-6 sm:h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>;
});
AppLayout.displayName = 'AppLayout';
export default AppLayout;