import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// this route is used to fectch current user details

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user: data.user });
}
