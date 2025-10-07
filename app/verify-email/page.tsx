// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function VerifyEmail() {
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => router.push('/login'), 2000);
//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen text-center">
//       <p className="text-lg font-medium mb-2">Email verified successfully!</p>
//       <p className="text-sm text-muted-foreground">You can now log in with your credentials.</p>
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/login'), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">{'Success'}</span>
        </div>

        <h1 className="text-xl font-semibold text-foreground">Email verified successfully!</h1>
        <p className="text-sm text-muted-foreground mt-2">
          You can now log in with your credentials.
        </p>

        <Button type="button" onClick={() => router.push('/login')} className="w-full mt-6">
          Go to Login
        </Button>

        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          Redirecting you in 2 seconds...
        </p>
      </div>
    </main>
  );
}
