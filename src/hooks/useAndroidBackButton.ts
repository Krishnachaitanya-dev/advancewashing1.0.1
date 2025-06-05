import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

export const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      // If we're on the home page, exit the app
      if (location.pathname === '/home' || location.pathname === '/') {
        App.exitApp();
        return;
      }
      
      // Otherwise, navigate back
      navigate(-1);
    };

    // Add the back button listener
    const backButtonListener = App.addListener('backButton', handleBackButton);

    // Cleanup
    return () => {
      backButtonListener.remove();
    };
  }, [location.pathname, navigate]);
};
