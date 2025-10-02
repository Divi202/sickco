'use client';

import dynamic from 'next/dynamic';
import SiteFooter from '@/components/home/footer';
import Navbar from '@/components/home/navbar';

// Dynamically import Hero to ensure it's only rendered on client
const Hero = dynamic(() => import('@/components/home/hero'), {
  ssr: false,
});

/**
 * Home Page Component
 *
 * The main landing page of the SickCo application that displays the health symptom
 * input interface. This page serves as the primary entry point for users to describe
 * their symptoms and receive AI-powered health analysis.
 *
 * Features:
 * - Responsive design with gradient background
 * - Centered layout for optimal user experience
 * - Integration with SymptomInput component
 *
 * @returns {JSX.Element} The rendered home page component
 */

// import SymptomInput from '@/components/home/SymptomInput';

export default function Home() {
  return (
    // <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    // <Navbar />
    // <UserInput />
    // </main>

    <main>
      <Navbar />
      <Hero />
      <SiteFooter />
    </main>
  );
}
