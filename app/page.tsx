'use client';
/**
 * Home Page
 *
 * Main page featuring the health symptom input interface
 */

import SymptomInput from '@/components/SymptomInput';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <SymptomInput />
    </main>
  );
}
