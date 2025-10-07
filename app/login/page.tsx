'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { LoginFormData, loginSchema } from '@/types/login.types';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await axios.post('/api/v1/auth/login', data);
      router.push('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-8 shadow-md"
        >
          <h1 className="text-center text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Sign in to your SickCo account
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

          <FormField
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
          />

          <Button
            type="submit"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Login'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-primary hover:opacity-90 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
