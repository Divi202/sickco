// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED = [/^\/api\/v1\/chat/, /^\/api\/v1\/auth\/me/,  /^\/api\/v1\/auth\/logout/];

export async function middleware(req: NextRequest) {
  // keep your existing session sync
  const res = await updateSession(req);

  // guard API routes
  if (PROTECTED.some((r) => r.test(req.nextUrl.pathname))) {
    const auth = req.cookies.get('sb-access-token') || req.headers.get('authorization');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return res;
}