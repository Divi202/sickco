'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

export default function VerifyEmail() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      const supabase = createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error('Verification error:', error);
        setStatus('error');
        return;
      }

      setStatus('success');
      // Wait a moment for cookies/session to store
      setTimeout(() => router.push('/dashboard'), 1500);
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      {status === 'verifying' && (
        <>
          <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
          <p>Verifying your email...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <p className="text-green-600 font-medium">Email verified successfully!</p>
          <p>Redirecting to your dashboard...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="text-red-500 font-medium">Verification failed.</p>
          <p>Link may be expired or invalid.</p>
        </>
      )}
    </div>
  );
}
