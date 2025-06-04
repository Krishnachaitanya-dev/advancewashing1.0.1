
import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const RateAppPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = () => {
    // Here you would typically submit to backend
    console.log('Rating:', rating, 'Feedback:', feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="mb-6 flex items-center">
          <Link to="/profile" className="mr-4 text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Rate Our App</h1>
        </div>

        <div className="glass-card p-8 text-center">
          <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-white/70 mb-6">
            Your feedback helps us improve our services and provide you with a better experience.
          </p>
          <Link to="/profile">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white">
              Back to Profile
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/profile" className="mr-4 text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Rate Our App</h1>
      </div>

      <div className="glass-card p-6">
        <div className="text-center mb-8">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">How was your experience?</h2>
          <p className="text-white/70">
            Your feedback helps us serve you better
          </p>
        </div>

        <div className="mb-8">
          <p className="text-white text-center mb-4">Rate your experience:</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="transition-colors"
              >
                <Star
                  size={40}
                  className={star <= rating ? 'text-yellow-400 fill-current' : 'text-white/30'}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-white/70 mt-2">
              {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
              {rating === 2 && "We appreciate your feedback. Help us do better."}
              {rating === 3 && "Thank you! We'd love to know how we can improve."}
              {rating === 4 && "Great! We're glad you enjoyed our service."}
              {rating === 5 && "Awesome! Thank you for the amazing feedback!"}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="text-white block mb-2 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Tell us more (optional):
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about the app, suggestions for improvement, or what you loved most..."
            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none h-32 focus:outline-none focus:border-white/40"
            maxLength={500}
          />
          <p className="text-white/50 text-sm mt-1">{feedback.length}/500 characters</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Rating
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              // Open app store for rating
              window.open('https://play.google.com/store', '_blank');
            }}
          >
            Rate on Play Store
          </Button>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-white font-medium mb-2">Why rate our app?</h3>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Help other users discover our service</li>
            <li>• Support our small business</li>
            <li>• Help us prioritize new features</li>
            <li>• Improve the overall user experience</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default RateAppPage;
