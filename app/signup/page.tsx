'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { VerificationMessage } from '@/components/user/verification-message';
import { SignupFormData, signupSchema } from '@/types/signup.types';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { PasswordStrengthIndicator } from '@/components/user/password-strength-indicator';

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        <Form {...form}>
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <PasswordStrengthIndicator password={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Sign Up'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-primary hover:opacity-90 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
