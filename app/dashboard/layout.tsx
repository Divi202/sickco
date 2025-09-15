// app/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// this layout page is to protect the page (check whether the user is authenticated or not)
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/login');
  }

  return <>{children}</>;
}
