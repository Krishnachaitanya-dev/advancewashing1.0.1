
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
      <div className="container mx-auto px-4 py-6">
        {/* Admin Header */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/80">Welcome, {user?.user_metadata?.name || user?.email}</p>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-red-500/50 text-red-300 hover:bg-red-500/20 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Admin Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
