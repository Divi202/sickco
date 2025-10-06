'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@/lib/supabase/client';
import ChatWindow from '@/components/dashboard/chat/chat-window';
import DietPlan from '@/components/dashboard/chat/diet-plans';
import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardPage() {
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // which section to show : sickoai ui or diet plan.
  const section = searchParams.get('section');
  const selectedFeature = section ?? 'sickco-ai';
  const initialSymptoms = searchParams.get('userInput');
  const [initialSymptomState, setInitialSymptomState] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verificationLoading, setVerificationLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    const checkUserAndVerification = async () => {
      try {
        // Get user data
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);

        // Check verification status
        if (userData.user) {
          const response = await axios.get('/api/v1/auth/verify');
          setIsVerified(response.data.isVerified);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setVerificationLoading(false);
      }
    };

    checkUserAndVerification();

    // Only set initial symptoms once when component mounts and userInput exists
    if (initialSymptoms && !initialSymptomState) {
      setInitialSymptomState(initialSymptoms);
      // Remove userInput from the URL after storing it in state
      const params = new URLSearchParams(searchParams.toString());
      params.delete('userInput');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  }, [initialSymptoms, searchParams, router, pathname, initialSymptomState]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/v1/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error message to the user
    }
    setIsLoading(false);
  };

  if (!user) return null;

  // Show loading state while checking verification
  if (verificationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect or show verification required message
  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-semibold">Email Verification Required</h1>
        <p className="text-muted-foreground">
          Please check you inbox to verify your email address to access the dashboard.
        </p>
        {/* Resend the verification email btn */}
        {/* <Button
          onClick={async () => {
            try {
              await axios.post('/api/v1/auth/resend-verification');
              alert('Verification email sent!');
            } catch (error) {
              console.error('Error sending verification email:', error);
              alert('Failed to send verification email');
            }
          }}
        >
          Resend Verification Email
        </Button> */}
        {/* Back to home or signup page  */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Home
          </Button>
          <Button onClick={() => router.push('/signup')}>Sign Up</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Mobile top bar with menu - faluto ka header section in mobile view hanvign hamburger button*/}

      <div className="flex items-center justify-between border-b px-4 md:py-2 md:hidden ">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base font-semibold">
            <span>Sick</span>
            <span className="text-primary">Co</span>
          </span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" aria-describedby={undefined}>
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation menu</SheetTitle>
              <SheetDescription>Site sections and account actions</SheetDescription>
            </SheetHeader>
            <Sidebar
              user={user}
              onLogout={handleLogout}
              active={selectedFeature}
              isLoading={isLoading}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid max-w-screen md:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block border-r">
          <Sidebar
            user={user}
            onLogout={handleLogout}
            active={selectedFeature}
            isLoading={isLoading}
          />
        </aside>

        {/* Main content */}
        <section className="flex-1 max-h-screen">
          {/* chat window by default has sickco-ai section  */}
          {selectedFeature === 'sickco-ai' && (
            <ChatWindow
              key={initialSymptomState || 'default'}
              initialMessage={initialSymptomState || ''}
            />
          )}
          {selectedFeature === 'diet-plans' && <DietPlan />}
        </section>
      </div>
    </main>
  );
}
