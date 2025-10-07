'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.debug(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-3">Something went wrong!</h2>

        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem
          persists.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-muted/50 border border-border rounded-md">
            <p className="text-sm text-muted-foreground font-mono break-words">{error.message}</p>
          </div>
        )}

        <Button
          onClick={reset}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
