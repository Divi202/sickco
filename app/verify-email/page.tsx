//

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/login'), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-lg font-medium mb-2">Email verified successfully!</p>
      <p className="text-sm text-muted-foreground">You can now log in with your credentials.</p>
    </div>
  );
}
