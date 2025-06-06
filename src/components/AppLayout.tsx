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
  return <div className="min-h-screen relative overflow-hidden">
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header - reduced padding */}
        <header className="px-3 flex items-center justify-center glass-card mx-3 mt-2 safe-area-top py-[10px]">
          <div className="flex items-center">
            <img src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" alt="AW Logo" className="w-6 h-6 mr-2" loading="lazy" />
            <h1 className="text-white text-base font-semibold py-px my-px">Advance Washing</h1>
          </div>
        </header>

        {/* Main content - reduced padding */}
        <main className="flex-1 px-3 py-2 pb-16 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation - much smaller and more compact */}
        <nav className="fixed bottom-2 left-3 right-3 glass-card safe-area-bottom rounded-lg">
          <div className="flex justify-around items-center py-1">
            <Link to="/" className={`px-2 py-1 flex flex-col items-center min-h-[44px] justify-center ${isActive('/') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <Home size={16} />
              <span className="text-[10px] mt-0.5">Home</span>
            </Link>
            <Link to="/services" className={`px-2 py-1 flex flex-col items-center min-h-[44px] justify-center ${isActive('/services') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <ShoppingBag size={16} />
              <span className="text-[10px] mt-0.5">Services</span>
            </Link>
            <Link to="/orders" className={`px-2 py-1 flex flex-col items-center min-h-[44px] justify-center ${isActive('/orders') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <Package size={16} />
              <span className="text-[10px] mt-0.5">Orders</span>
            </Link>
            <Link to="/profile" className={`px-2 py-1 flex flex-col items-center min-h-[44px] justify-center ${isActive('/profile') ? 'text-blue-300' : 'text-white/70'} transition-all duration-300 active:scale-95 hover:text-blue-200`}>
              <User size={16} />
              <span className="text-[10px] mt-0.5">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>;
});
AppLayout.displayName = 'AppLayout';
export default AppLayout;