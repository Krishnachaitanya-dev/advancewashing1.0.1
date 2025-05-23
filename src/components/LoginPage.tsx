
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-cyan-400/40 to-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-300/25 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Secondary floating elements */}
        <div className="absolute top-20 right-1/4 w-48 h-48 bg-gradient-to-bl from-yellow-300/20 to-orange-400/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tl from-indigo-400/25 to-purple-500/20 rounded-full blur-2xl"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 via-transparent to-cyan-400/10"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-16 w-1 h-1 bg-cyan-300/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-300/70 rounded-full animate-bounce"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          {/* Card background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                <img 
                  src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
                  alt="AW Logo" 
                  className="w-16 h-16 object-contain relative z-10"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome Back</h1>
              <p className="text-white/80 text-lg">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-12 h-14 bg-white/20 backdrop-blur-xl border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 pr-12 h-14 bg-white/20 backdrop-blur-xl border-white/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-white placeholder:text-white/60"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-cyan-300 hover:text-cyan-200 font-medium transition-colors underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group border-0"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-white/30"></div>
              <span className="px-4 text-sm text-white/80">or</span>
              <div className="flex-1 border-t border-white/30"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white/15 backdrop-blur-xl border-white/30 hover:bg-white/25 rounded-xl transition-all duration-200 text-white hover:text-white"
              >
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
                  Continue with Google
                </div>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-white/80">
                Don't have an account?{' '}
                <button className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors underline">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            By continuing, you agree to our{' '}
            <button className="underline hover:text-white transition-colors">Terms of Service</button>
            {' '}and{' '}
            <button className="underline hover:text-white transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
