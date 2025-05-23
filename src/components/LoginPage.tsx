
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center justify-center p-6 relative">
      {/* Logo and Brand Section */}
      <div className="text-center mb-16">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
            alt="AW Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-white text-2xl font-semibold">Advance Washing</h2>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-white text-4xl font-light mb-2">Welcome to</h1>
        <h1 className="text-white text-4xl font-light">Advance Washing</h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              className="h-14 bg-white/90 backdrop-blur-xl border-0 rounded-full px-6 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-0 focus:outline-none shadow-lg"
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
              className="h-14 bg-white/90 backdrop-blur-xl border-0 rounded-full px-6 pr-14 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-0 focus:outline-none shadow-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
            className="w-full h-16 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-full shadow-xl transition-all duration-300 text-xl border-0"
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
          <p className="text-white/90 text-lg">
            Don't have an account?{' '}
            <button className="text-white font-semibold hover:underline transition-all">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
