'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { VerificationMessage } from '@/components/dashboard/user/verification-message';
import { SignupFormData, signupSchema } from '@/types/signup.types';

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Add this with other state declarations at the top
  const [showVerification, setShowVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await axios.post('/api/v1/auth/signup', {
        email: data.email,
        password: data.password,
      });

      // Check if email verification is required
      if (result.data.requiresEmailVerification) {
        setShowVerification(true);
        setVerificationMessage(result.data.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {showVerification ? (
        <VerificationMessage message={verificationMessage} />
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-8 shadow-md"
        >
          <h1 className="text-center text-2xl font-semibold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Join SickCo to get started
          </p>

          {serverError && (
            <p className="text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {serverError}
            </p>
          )}

          {/* Email Field */}
          <Input placeholder="you@example.com" {...form.register('email')} />

          {/* Password Field */}
          <Input type="password" placeholder="********" {...form.register('password')} />

          {/* Confirm Password Field */}
          <Input type="password" placeholder="********" {...form.register('confirmPassword')} />

          <Button
            type="submit"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin"></LoaderCircle> : 'Sign Up'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-primary hover:opacity-90 font-medium transition-colors "
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
