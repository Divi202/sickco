/**
 * Main Dashboard Component - Container for the entire dashboard layout
 * Manages global state and coordinates between Sidebar and Chat components
 */
'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Chat from '@/components/dashboard/Chat';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

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
  const initialSymptoms = searchParams.get('userInput'); // Get the 'symptoms' query parameter

  const handleFeatureSelect = (featureId) => {
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

      <Chat onToggleMobileMenu={handleToggleMobileMenu} initialMessage={initialSymptoms || ''} />
    </div>
  );
};

export default Dashboard;
