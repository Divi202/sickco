'use client';

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
import UserInput from '@/components/home/UserInput';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* <SymptomInput /> changed to user input  */}
      <UserInput />
    </main>
  );
}
