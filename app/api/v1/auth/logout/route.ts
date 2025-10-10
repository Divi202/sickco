// app/api/v1/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { usersService } from '@/modules/users/users.service';
import { log } from '@/lib/log';
import { ExternalApiError } from '@/lib/errors';

export async function POST() {
  log.info('Auth API: Logout endpoint called...');

  try {
    const result = await usersService.logout();

    log.info('Auth API: Logout successful');
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    // External API error (Supabase auth errors)
    if (error instanceof ExternalApiError) {
      log.error('Auth API: Logout Error');
      return NextResponse.json({ error: 'Logout failed' }, { status: error.statusCode });
    }

    // General fallback error
    log.error('Auth API: Unexpected error in logout');
    return NextResponse.json({ error: 'Logout failed. Please try again later.' }, { status: 500 });
  }
}
