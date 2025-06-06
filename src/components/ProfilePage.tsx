import React, { memo } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { User, MapPin, Star, Shield, FileText, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = memo(() => {
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const accountMenuItems = [{
    icon: <User className="w-5 h-5" />,
    label: 'Personal Information',
    path: '/personal-information',
    description: 'Update your profile details'
  }, {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address Management',
    path: '/address-management',
    description: 'Manage your delivery addresses'
  }];

  const supportMenuItems = [{
    icon: <Star className="w-5 h-5" />,
    label: 'Rate Our App',
    path: '/rate-app',
    description: 'Share your feedback'
  }, {
    icon: <Shield className="w-5 h-5" />,
    label: 'Privacy Policy',
    path: '/privacy-policy',
    description: 'How we protect your data'
  }, {
    icon: <FileText className="w-5 h-5" />,
    label: 'Terms of Service',
    path: '/terms-of-service',
    description: 'App terms and conditions'
  }];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="glass-card p-6 py-[2px]">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-600/60 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-700">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-slate-600 text-sm">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 px-2 py-1 bg-amber-600/60 text-amber-100 text-xs font-medium rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-slate-600 text-sm font-medium uppercase tracking-wide px-2">Account</h3>
          <div className="space-y-3">
            {accountMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="glass-card p-4 hover:bg-slate-50 transition-all duration-200 hover:scale-[1.02] my-[5px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-600">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-medium text-sm">{item.label}</p>
                        <p className="text-slate-600 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-slate-600 text-sm font-medium uppercase tracking-wide px-2">Support</h3>
          <div className="space-y-3">
            {supportMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="glass-card p-4 hover:bg-slate-50 transition-all duration-200 hover:scale-[1.02] my-[5px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-slate-600">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-medium text-sm">{item.label}</p>
                        <p className="text-slate-600 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="glass-card p-4">
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full border-slate-300 flex items-center justify-center space-x-2 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center text-slate-600 text-xs pb-4">
          Advance Washing v1.0.0
        </div>
      </div>
    </AppLayout>
  );
});

ProfilePage.displayName = 'ProfilePage';
export default ProfilePage;
