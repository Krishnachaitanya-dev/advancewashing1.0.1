
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Moon, Sun, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'English',
    notifications: true,
    autoBackup: true,
    twoFactor: false
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4">
          <h3 className="text-white text-lg font-medium mb-4">Appearance</h3>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              {settings.darkMode ? <Moon className="w-5 h-5 text-white/70 mr-3" /> : <Sun className="w-5 h-5 text-white/70 mr-3" />}
              <div>
                <p className="text-white">Dark Mode</p>
                <p className="text-white/60 text-sm">Toggle dark/light theme</p>
              </div>
            </div>
            <Button
              onClick={() => handleToggle('darkMode')}
              variant="outline"
              size="sm"
              className="border-white/20 text-white"
            >
              {settings.darkMode ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-white text-lg font-medium mb-4">General</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-white/70 mr-3" />
                <div>
                  <p className="text-white">Language</p>
                  <p className="text-white/60 text-sm">App language preference</p>
                </div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => setSettings(prev => ({...prev, language: e.target.value}))}
                className="bg-blue-900/60 text-white border border-white/20 rounded px-3 py-1"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-white/70 mr-3" />
                <div>
                  <p className="text-white">Auto Backup</p>
                  <p className="text-white/60 text-sm">Automatically backup data</p>
                </div>
              </div>
              <Button
                onClick={() => handleToggle('autoBackup')}
                variant="outline"
                size="sm"
                className="border-white/20 text-white"
              >
                {settings.autoBackup ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-white text-lg font-medium mb-4">Security</h3>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-white/70 mr-3" />
              <div>
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-white/60 text-sm">Add extra security to your account</p>
              </div>
            </div>
            <Button
              onClick={() => handleToggle('twoFactor')}
              variant="outline"
              size="sm"
              className="border-white/20 text-white"
            >
              {settings.twoFactor ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
