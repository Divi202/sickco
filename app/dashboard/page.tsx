/**
 * Main Dashboard Component - Container for the entire dashboard layout
 * Manages global state and coordinates between Sidebar and Chat components
 */
'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Chat from '@/components/dashboard/Chat';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

/**
 * Dashboard Component - Main container that coordinates Sidebar and Chat
 * Manages global state for selected features and mobile menu
 */
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return null;
  const [selectedFeature, setSelectedFeature] = useState('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams(); // Initialize useSearchParams
  const initialSymptoms = searchParams.get('userInput'); // Get the 'symptoms' query parameter

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar
        selectedFeature={selectedFeature}
        onFeatureSelect={handleFeatureSelect}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobile={handleCloseMobileMenu}
      />
      {/* <Chat onToggleMobileMenu={handleToggleMobileMenu} initialMessage={initialSymptoms || ''} /> */}
      {/* Chat V2  */}
      <Chat onToggleMobileMenu={handleToggleMobileMenu} initialMessage={initialSymptoms || ''} />
    </div>
  );
};

export default Dashboard;
