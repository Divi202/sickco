import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/log';

/* What this does:

- Reads the confirmation code from the URL.

- Calls Supabase to exchange it for a session.

- Automatically stores session tokens in secure cookies.

- Redirects the user to /dashboard.*/

export async function GET(req: Request) {
  try {
    log.info('Starting email verification process');
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      log.warn('Missing verification code');
      return NextResponse.json(
        {
          success: false,
          message: 'Verification code is required',
          error: 'MISSING_CODE',
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(req.url);

    if (error) {
      log.error('Failed to exchange verification code');

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired verification link',
          error: 'INVALID_CODE',
        },
        { status: 401 },
      );
    }

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Unexpected error during verification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        error: 'VERIFICATION_FAILED',
      },
      { status: 500 },
    );
  }
}
