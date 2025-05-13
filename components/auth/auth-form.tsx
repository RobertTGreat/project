'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // If Supabase is not available, show a friendly message
    if (!hasEnvVars) {
      setMessage('Authentication is currently unavailable. The application is running in demo mode.');
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
        setIsSignUp(false); // Switch to login view after successful sign up request
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      if (error.message.includes('fetch failed') || error.message.includes('Supabase connection unavailable')) {
        setMessage('Authentication service is currently unavailable. Please try again later.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg border border-white/10 bg-card/25 text-card-foreground shadow-sm backdrop-blur-xl"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <h2 className="text-2xl font-bold text-center text-white">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </h2>

        {!hasEnvVars && (
          <div className="p-4 rounded-md bg-white/5 border border-white/10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/80">
              <p className="font-medium text-white mb-1">Authentication Unavailable</p>
              <p>The application is running in demo mode. Authentication features are simulated but not functional.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </Button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-300">{message}</p>
        )}
        <p className="mt-4 text-center text-sm text-white/70">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(''); // Clear message on toggle
            }}
            className="font-medium text-white hover:text-white/80"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}