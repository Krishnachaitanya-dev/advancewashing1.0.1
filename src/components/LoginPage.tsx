
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Water-like background with multiple gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 overflow-hidden">
        {/* Animated wave effect overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-[200%] animate-[wave_15s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.4)_0%,_rgba(255,255,255,0)_70%)]" 
               style={{backgroundSize: "200% 200%", transform: "rotate(-45deg)"}}></div>
          <div className="absolute top-1/4 left-1/4 w-full h-[200%] animate-[wave_18s_ease-in-out_infinite] animate-delay-300 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0)_70%)]"
               style={{backgroundSize: "200% 200%", transform: "rotate(-30deg)"}}></div>
          <div className="absolute bottom-0 right-0 w-[200%] h-[200%] animate-[wave_16s_ease-in-out_infinite] animate-delay-500 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0)_70%)]"
               style={{backgroundSize: "200% 200%", transform: "rotate(15deg)"}}></div>
        </div>
        
        {/* Subtle bubble effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYnViYmxlIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiIGZ4PSI1MCUiIGZ5PSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-20 mix-blend-overlay"
             style={{backgroundSize: "5% 5%"}}></div>
             
        {/* Light shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-300/10 to-blue-600/20 mix-blend-overlay"></div>
      </div>

      {/* Logo and Brand Section */}
      <div className="text-center mb-12 z-10">
        {/* Logo */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-sm bg-white/30 rounded-full transform scale-110"></div>
            <img 
              src="/lovable-uploads/786946c3-52e3-4da5-b6cf-56e1dae12c59.png" 
              alt="AW Logo" 
              className="w-24 h-24 mx-auto mb-4 relative z-10 drop-shadow-lg"
            />
          </div>
          <h2 className="text-white text-2xl font-semibold text-shadow">Advance Washing</h2>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-white text-4xl font-light mb-2 text-shadow">Welcome to</h1>
        <h1 className="text-white text-4xl font-light text-shadow">Advance Washing</h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm space-y-6 z-10">
        <div className="backdrop-blur-md bg-white/20 rounded-3xl p-8 shadow-xl border border-white/25">
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
                className="text-white hover:text-white/80 font-medium transition-colors text-lg"
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
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-white/90 text-lg drop-shadow">
            Don't have an account?{' '}
            <button className="text-white font-semibold hover:underline transition-all">
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Add keyframes for wave animation to index.css */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0) rotate(-45deg);
          }
          50% {
            transform: translateY(-20px) rotate(-45deg);
          }
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
