
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
        <div className="glass-card p-6 py-[2px] relative profile-section">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600/60 rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30">👤</div>
              <User className="w-8 h-8 text-white relative z-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-600">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'} 😊
              </h2>
              <p className="text-blue-500 text-sm">📧 {user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-1 px-2 py-1 bg-blue-600/60 text-blue-100 text-xs font-medium rounded">
                  👑 Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-blue-500 text-sm font-medium uppercase tracking-wide px-2">⚙️ Account</h3>
          <div className="space-y-3">
            {accountMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="glass-card p-4 hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] my-[5px] relative account-section">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-500 relative">
                        <div className="absolute -top-1 -right-1 text-xs opacity-50">
                          {index === 0 ? '📝' : '🏠'}
                        </div>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-600 font-medium text-sm">{item.label}</p>
                        <p className="text-blue-500 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-blue-500 text-sm font-medium uppercase tracking-wide px-2">💬 Support</h3>
          <div className="space-y-3">
            {supportMenuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="glass-card p-4 hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] my-[5px] relative support-section">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-500 relative">
                        <div className="absolute -top-1 -right-1 text-xs opacity-50">
                          {index === 0 ? '⭐' : index === 1 ? '🔒' : '📄'}
                        </div>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-600 font-medium text-sm">{item.label}</p>
                        <p className="text-blue-500 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-xl opacity-20">👋</div>
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full border-blue-300 flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out 🚪</span>
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center text-blue-500 text-xs pb-4">
          🚀 Advance Washing v1.0.0 ✨
        </div>
      </div>
    </AppLayout>
  );
});

ProfilePage.displayName = 'ProfilePage';
export default ProfilePage;
