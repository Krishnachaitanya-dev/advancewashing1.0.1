
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.advancewashing.app',
  appName: 'Advancewashing',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Enable hot reload for development (comment out for production)
    url: 'https://b916e345-5208-4d12-a131-dcb9bd3b440b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    // Optimize WebView for better performance
    webContentsDebuggingEnabled: false,
    // Improve startup performance
    backgroundColor: '#3B82F6'
  },
  // Add performance optimizations
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
