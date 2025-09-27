// /**
//  * Main Dashboard Component - Container for the entire dashboard layout
//  * Manages global state and coordinates between Sidebar and Chat components
//  */
// 'use client';
// import React, { useEffect, useState } from 'react';
// import Sidebar from '@/components/dashboard/sidebar';
// import { useSearchParams } from 'next/navigation'; // Import useSearchParams
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { createClient } from '@/lib/supabase/client';
// import Chat from '@/components/dashboard/Chat';
// // =============================================================================
// // MAIN DASHBOARD COMPONENT
// // =============================================================================

// /**
//  * Dashboard Component - Main container that coordinates Sidebar and Chat
//  * Manages global state for selected features and mobile menu
//  */
// const Dashboard = () => {
//   const [selectedFeature, setSelectedFeature] = useState('chat');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const searchParams = useSearchParams(); // Initialize useSearchParams
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//     });
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post('/api/v1/auth/logout');
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//       // Optionally, display an error message to the user
//     }
//   };

//   if (!user) return null;

//   const initialSymptoms = searchParams.get('userInput'); // Get the 'symptoms' query parameter

//   const handleFeatureSelect = (featureId: string) => {
//     setSelectedFeature(featureId);
//   };

//   const handleToggleMobileMenu = () => {
//     setIsMobileMenuOpen(true);
//   };

//   const handleCloseMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       <Sidebar
//         selectedFeature={selectedFeature}
//         onFeatureSelect={handleFeatureSelect}
//         isMobileMenuOpen={isMobileMenuOpen}
//         onCloseMobile={handleCloseMobileMenu}
//         user={user}
//         onLogout={handleLogout}
//       />
//       {/* Render Chat component only if 'chat' is selected */}
//       {selectedFeature === 'chat' && (
//         <Chat onToggleMobileMenu={handleToggleMobileMenu} initialMessage={initialSymptoms || ''} />
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import type { Metadata } from 'next';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatWindow from '@/components/dashboard/chatv2/chat-window';

export const metadata: Metadata = {
  title: 'Dashboard • SickCo',
};

export default function DashboardPage({ searchParams }: { searchParams: { section?: string } }) {
  const section = (searchParams?.section || 'sickco-ai') as 'sickco-ai' | 'diet-plans';

  return (
    <main className="min-h-[calc(100vh-56px)] bg-background text-foreground">
      {/* Mobile top bar with menu */}
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
          <SheetContent side="left" className="w-72 p-0">
            <Sidebar active={section} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid max-w-screen md:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block border-r">
          <Sidebar active={section} />
        </aside>

        {/* Main content */}
        <section className="min-h-[70vh]">
          {section === 'sickco-ai' ? (
            <ChatWindow />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <h1 className="text-2xl font-semibold">Diet Plans</h1>
              <p className="text-muted-foreground max-w-prose">
                Personalized diet plans tailored to your recovery and goals.
              </p>
              <div className="rounded-2xl border bg-muted/10 p-6">
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  Coming soon
                </div>
              </div>
              <Link
                href="/dashboard?section=sickco-ai"
                className="text-sm underline underline-offset-4"
              >
                Back to Sickco AI
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
