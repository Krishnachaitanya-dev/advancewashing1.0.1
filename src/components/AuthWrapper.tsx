
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from './LoginPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading } = useAuth();

  console.log('AuthWrapper - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
