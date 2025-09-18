// lib/auth.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/log';
import { ValidationError, ExternalApiError } from '@/lib/errors';

export async function requireUserFromCookies() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    log.warn('Auth: no user from cookies', error?.message);
    throw new ExternalApiError('Unauthorized');
  }
  return data.user;
}

// For machine-to-machine or external callers passing Authorization header
export async function getUserFromBearer(token: string | undefined) {
  if (!token?.startsWith('Bearer ')) return null;
  const accessToken = token.replace('Bearer ', '');
  const supabase = await createClient(); // configured to allow token validation
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

// Convenience: checks both cookies and Authorization header
export async function requireUser(req?: NextRequest) {
  const headerUser = await getUserFromBearer(req?.headers.get('authorization') || undefined);
  if (headerUser) return headerUser;
  return requireUserFromCookies();
}