
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.advancewashing.app',
  appName: 'Advancewashing',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Remove the development URL for production builds
    // url: 'https://b916e345-5208-4d12-a131-dcb9bd3b440b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#3B82F6',
    // Add better handling for offline content
    useLegacyBridge: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    // Add App plugin for better mobile handling
    App: {
      launchUrl: 'index.html'
    },
    // Add Geolocation plugin configuration
    Geolocation: {
      permissions: {
        location: 'always'
      }
    }
  }
};

export default config;
