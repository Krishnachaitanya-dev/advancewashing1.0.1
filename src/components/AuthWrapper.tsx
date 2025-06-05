
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './LoginPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  console.log('AuthWrapper - User:', user, 'Loading:', loading, 'IsAdmin:', isAdmin);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      // Redirect admin users to admin page if they're not already there
      if (window.location.pathname !== '/admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, loading, isAdmin, navigate]);

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
