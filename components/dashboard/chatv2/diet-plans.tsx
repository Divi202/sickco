import { Link } from 'lucide-react';
import React from 'react';

function DietPlan() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <h1 className="text-2xl font-semibold">Diet Plans</h1>
      <p className="text-muted-foreground max-w-prose">
        Personalized diet plans tailored to your recovery and goals.
      </p>
      <div className="rounded-2xl border bg-muted/10 p-6">
        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Coming soon</div>
      </div>
      <Link href="/dashboard?section=sickco-ai" className="text-sm underline underline-offset-4">
        Back to Sickco AI
      </Link>
    </div>
  );
}

export default DietPlan;
