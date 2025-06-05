
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex flex-col items-center justify-center p-6 relative">
      {/* Logo and Brand Section */}
      <div className="text-center mb-12">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
            alt="AW Logo" 
            className="w-24 h-24 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-white text-3xl font-semibold tracking-wide">Advance Washing</h1>
          <p className="text-white/80 text-lg mt-2 font-light">Professional Laundry Services</p>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <div>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="h-14 bg-white/95 border-0 rounded-xl px-6 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-2 focus:ring-white/30 focus:outline-none shadow-xl backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (Optional)"
                  className="h-14 bg-white/95 border-0 rounded-xl px-6 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-2 focus:ring-white/30 focus:outline-none shadow-xl backdrop-blur-sm"
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-14 bg-white/95 border-0 rounded-xl px-6 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-2 focus:ring-white/30 focus:outline-none shadow-xl backdrop-blur-sm"
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
              className="h-14 bg-white/95 border-0 rounded-xl px-6 pr-14 text-gray-700 placeholder:text-gray-500 text-lg focus:ring-2 focus:ring-white/30 focus:outline-none shadow-xl backdrop-blur-sm"
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

          {/* Forgot Password - only show on login */}
          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                className="text-white/90 hover:text-white font-medium transition-colors text-base underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 text-xl border border-white/30 backdrop-blur-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignUp ? 'Sign Up' : 'Log in'
            )}
          </Button>
        </form>

        {/* Toggle Sign Up/Login */}
        <div className="text-center mt-8">
          <p className="text-white/90 text-base">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={toggleMode}
              className="text-white font-semibold hover:underline transition-all underline-offset-4"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
