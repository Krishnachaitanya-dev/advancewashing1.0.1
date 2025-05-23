
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Advance Washing</h1>
        <p className="text-xl mb-8 text-white/90">Professional Laundry Service</p>
        <Link to="/login">
          <Button className="bg-white text-blue-600 hover:bg-white/90 px-8 py-3 rounded-xl font-semibold">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
