
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in (for mobile app persistence)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Store login state for mobile app
      localStorage.setItem('isLoggedIn', 'true');
      // Navigate to home page after successful login
      navigate('/home', { replace: true });
    }, 1000); // Reduced delay for better mobile UX
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
      </div>

      {/* Logo and Brand Section */}
      <div className="text-center mb-16 z-10">
        {/* New AW Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            {/* AW Logo SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* A Letter */}
              <path
                d="M40 160 L60 100 L80 160 M50 140 L70 140"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
              />
              {/* W Letter */}
              <path
                d="M100 100 L110 160 L120 120 L130 160 L140 100"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
              />
              {/* Decorative elements */}
              <circle cx="90" cy="80" r="4" fill="rgba(255,255,255,0.8)" className="animate-pulse" />
              <circle cx="150" cy="90" r="3" fill="rgba(255,255,255,0.6)" className="animate-pulse delay-300" />
              <circle cx="50" cy="85" r="2" fill="rgba(255,255,255,0.7)" className="animate-pulse delay-700" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-wide">Advance Washing</h2>
        </div>
        
        {/* Welcome Text */}
        <div className="space-y-2">
          <h1 className="text-white text-4xl font-light tracking-wide">Welcome to</h1>
          <h1 className="text-white text-4xl font-light tracking-wide">Advance Washing</h1>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm space-y-6 z-10">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              className="h-16 bg-white/95 border-0 rounded-full px-6 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-0 focus:outline-none shadow-xl backdrop-blur-sm font-medium"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-16 bg-white/95 border-0 rounded-full px-6 pr-16 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-0 focus:outline-none shadow-xl backdrop-blur-sm font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-white/90 hover:text-white font-medium transition-colors text-lg"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-blue-900/90 hover:bg-blue-800 text-white font-bold rounded-full shadow-2xl transition-all duration-300 text-xl border-0 backdrop-blur-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Log in"
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-white/90 text-lg font-medium">
            Don't have an account?{' '}
            <button className="text-white font-bold hover:underline transition-all">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
