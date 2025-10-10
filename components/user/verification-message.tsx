// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

// interface VerificationMessageProps {
//   message: string;
// }

// export function VerificationMessage({ message }: VerificationMessageProps) {
//   const router = useRouter();

//   return (
//     <div className="w-full max-w-md space-y-4 bg-card border border-border rounded-xl p-8 shadow-md">
//       <h2 className="text-xl font-semibold text-center">Verify Your Email</h2>
//       <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
//         <p className="text-sm">{message}</p>
//         <p className="text-sm mt-2">Please check your inbox and spam folder.</p>
//       </div>
//       <Button type="button" onClick={() => router.push('/login')} className="w-full">
//         Go to Login
//       </Button>
//     </div>
//   );
// }

'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

interface VerificationMessageProps {
  message?: string;
  loginHref?: string;
}

export function VerificationMessage({
  message = 'We’ve sent a verification link to your email address.',
  loginHref = '/login',
}: VerificationMessageProps) {
  const router = useRouter();

  return (
    <div
      className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      role="region"
      aria-labelledby="verify-title"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <MailCheck className="h-5 w-5" />
        </div>
        <h2 id="verify-title" className="text-lg font-semibold text-foreground">
          Verify your email
        </h2>
      </div>

      <div className="rounded-lg border border-border/50 bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check your inbox and spam folder.
        </p>
      </div>

      <Button type="button" onClick={() => router.push(loginHref)} className="w-full">
        Go to Login
      </Button>
    </div>
  );
}

export default VerificationMessage;
