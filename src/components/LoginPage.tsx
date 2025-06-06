
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const result = await signUp(email, password, { name, phone });
        if (result.success) {
          // Don't redirect immediately for sign up, let user check email
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          navigate('/home', { replace: true });
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setPhone('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-3">
        {/* Logo and Brand Section - Compact */}
        <div className="text-center mb-3">
          <div className="mb-3">
            <div className="w-20 h-20 mx-auto mb-2">
              <img 
                src="/lovable-uploads/6032e746-b4da-4840-9d68-2afbfb5e432d.png" 
                alt="AW Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight mb-1">Advance Washing</h1>
            <p className="text-blue-200/80 text-sm font-light">Professional Laundry Services</p>
          </div>
        </div>

        {/* Auth Card - Compact */}
        <div className="w-full max-w-sm glass-card p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-white mb-1">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-blue-200/70 text-xs">
              {isSignUp ? 'Join us for premium laundry service' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-white text-xs font-medium">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 bg-white/10 border-white/20 rounded-lg px-3 text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-white text-xs font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number (optional)"
                    className="h-10 bg-white/10 border-white/20 rounded-lg px-3 text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-white text-xs font-medium">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10 bg-white/10 border-white/20 rounded-lg px-3 text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-white text-xs font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-10 bg-white/10 border-white/20 rounded-lg px-3 pr-10 text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password - only show on login */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors text-xs"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-xl transition-all duration-300 text-sm border-0 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle Sign Up/Login */}
          <div className="text-center mt-4 pt-3 border-t border-white/10">
            <p className="text-white/80 text-xs">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-blue-300 font-semibold hover:text-blue-200 transition-colors ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-3">
          <p className="text-white/50 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
