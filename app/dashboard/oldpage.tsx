/**
 * Main Dashboard Component - Container for the entire dashboard layout
 * Manages global state and coordinates between Sidebar and Chat components
 */
'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@/lib/supabase/client';
import Chat from '@/components/dashboard/Chat';
// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

/**
 * Dashboard Component - Main container that coordinates Sidebar and Chat
 * Manages global state for selected features and mobile menu
 */
const Dashboard = () => {
  const [selectedFeature, setSelectedFeature] = useState('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, display an error message to the user
    }
  };

  if (!user) return null;

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
        user={user}
        onLogout={handleLogout}
      />
      {/* Render Chat component only if 'chat' is selected */}
      {selectedFeature === 'chat' && (
        <Chat onToggleMobileMenu={handleToggleMobileMenu} initialMessage={initialSymptoms || ''} />
      )}
    </div>
  );
};

export default Dashboard;
