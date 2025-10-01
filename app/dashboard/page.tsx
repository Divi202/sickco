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
import ChatWindow from '@/components/dashboard/chatv2/chat-window';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@/lib/supabase/client';
import DietPlan from '@/components/dashboard/chatv2/diet-plans';
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
  // Get the user input send by homepage by query parameter
  const initialSymptoms = searchParams.get('userInput');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    if (initialSymptoms) {
      // Remove userInput from the URL after consuming it so it won't reappear on refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete('userInput');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
    // It's safe to depend on these; replace won't loop because the param is removed
  }, [initialSymptoms, searchParams, router, pathname]);

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

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background text-foreground">
      {/* Mobile top bar with menu - faluto ka header section in mobile view hanvign hamburger button*/}
      <div className="flex items-center justify-between border-b px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">
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
        <section className="max-h-screen">
          {/* chat window by default has sickco-ai section  */}
          {selectedFeature === 'sickco-ai' && (
            <ChatWindow key={initialSymptoms || 'default'} initialMessage={initialSymptoms || ''} />
          )}
          {selectedFeature === 'diet-plans' && <DietPlan />}
        </section>
      </div>
    </main>
  );
}
