import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface VerificationMessageProps {
  message: string;
}

export function VerificationMessage({ message }: VerificationMessageProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-md space-y-4 bg-card border border-border rounded-xl p-8 shadow-md">
      <h2 className="text-xl font-semibold text-center">Verify Your Email</h2>
      <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
        <p className="text-sm">{message}</p>
        <p className="text-sm mt-2">Please check your inbox and spam folder.</p>
      </div>
      <Button type="button" onClick={() => router.push('/login')} className="w-full">
        Go to Login
      </Button>
    </div>
  );
}
