'use client';

import { Input } from "@/app/components/ui/input"

import { useState } from 'react';

type Status = 'idle' | 'success' | 'error';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    // Optimistic UI - show success immediately
    const submittedEmail = email;
    setStatus('success');
    setMessage('Successfully subscribed to newsletter!');
    setEmail('');
    setName('');

    // API call in background
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${API_URL}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail, name: name || 'Anonymous' }),
      });

      const data = await response.json();

      // Only update if there was an error
      if (!data.success) {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
  };

  // Success state - animated celebration
  if (status === 'success') {
    return (
      <div className="mt-40 text-center">
        <div className="mx-auto max-w-xl">
          <div className="relative">
            {/* Animated success card */}
            <div className="animate-fade-in-up rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent p-10">

              {/* Animated checkmark */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 animate-bounce-slow">
                <svg
                  className="h-10 w-10 text-emerald-400 animate-draw-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Sparkles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-8 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-sparkle-1"></div>
                <div className="absolute top-12 right-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full animate-sparkle-2"></div>
                <div className="absolute top-16 left-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-sparkle-3"></div>
                <div className="absolute top-10 right-1/3 w-2 h-2 bg-teal-300 rounded-full animate-sparkle-4"></div>
              </div>

              <h3 className="text-2xl font-semibold text-emerald-400 mb-3 animate-fade-in">
                You're in! 🎉
              </h3>

              <p className="text-neutral-300 mb-2 animate-fade-in-delayed">
                {message}
              </p>

              <p className="text-neutral-500 text-sm animate-fade-in-delayed-2">
                Check your inbox for a welcome email from me.
              </p>

              <button
                onClick={resetForm}
                className="mt-8 text-sm text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-4"
              >
                Subscribe another email
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes draw-check {
            0% { stroke-dasharray: 0, 100; }
            100% { stroke-dasharray: 100, 0; }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          .animate-draw-check { 
            stroke-dasharray: 0, 100;
            animation: draw-check 0.6s ease-out 0.3s forwards; 
          }
          .animate-sparkle-1 { animation: sparkle 1.5s ease-in-out 0.2s infinite; }
          .animate-sparkle-2 { animation: sparkle 1.5s ease-in-out 0.4s infinite; }
          .animate-sparkle-3 { animation: sparkle 1.5s ease-in-out 0.6s infinite; }
          .animate-sparkle-4 { animation: sparkle 1.5s ease-in-out 0.8s infinite; }
          .animate-fade-in { animation: fade-in 0.5s ease-out 0.3s both; }
          .animate-fade-in-delayed { animation: fade-in 0.5s ease-out 0.5s both; }
          .animate-fade-in-delayed-2 { animation: fade-in 0.5s ease-out 0.7s both; }
        `}</style>
      </div>
    );
  }

  // Default form state
  return (
    <div className="mt-40 text-center">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          📧
        </div>

        <h2 className="text-3xl font-semibold text-white mb-3">
          Subscribe to my newsletter
        </h2>

        <p className="text-neutral-400 mb-10">
          No spam, promise. I only send curated blogs that match your
          interests — the stuff you'd actually want to read.
        </p>

        <form onSubmit={handleSubmit}>



          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1"
              required
            />

            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-black font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Subscribe — it takes 5 seconds
          </button>

          {/* Error message with animation */}
          {status === 'error' && message && (
            <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 animate-shake">
              <p className="text-sm text-red-400 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </p>
            </div>
          )}
        </form>

        <p className="mt-3 text-xs text-neutral-500">
          Unsubscribe anytime. Your email is safe with me.
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}