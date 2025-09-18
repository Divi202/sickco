// app/api/v1/auth/me/route.ts
import { NextResponse } from 'next/server';
import { log } from '@/lib/log';
import { ExternalApiError } from '@/lib/errors';
import { usersService } from '@/modules/users/users.service';

export async function GET() {
  log.info('Auth API: Me endpoint called...');

  try {
    const userResponse = await usersService.getCurrentUser();

    log.info('Auth API: User data fetched successfully');
    return NextResponse.json(userResponse, { status: 200 });
  } catch (error: any) {
    // External API error (Supabase auth errors)
    if (error instanceof ExternalApiError) {
      log.error('Auth API: Authentication Error', error.message);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // General fallback error
    log.error('Auth API: Unexpected error', error.message);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
