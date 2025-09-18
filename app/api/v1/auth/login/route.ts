// app/api/v1/auth/login/route.ts
import { NextResponse } from 'next/server';
import { usersService } from '@/modules/users/users.service';
import { log } from '@/lib/log';
import { ValidationError, ExternalApiError } from '@/lib/errors';
import { loginSchema } from '@/types/login.types';

export async function POST(request: Request) {
  log.info('Auth API: Login endpoint called...');

  try {
    const body = await request.json();

    // Input validation
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError('Invalid input data');
    }

    // Process through auth service
    const authResponse = await usersService.login(validationResult.data);

    log.info('Auth API: Login successful');
    return NextResponse.json(authResponse, { status: 200 });
  } catch (error: any) {
    // Validation error
    if (error instanceof ValidationError) {
      log.error('Auth API: Validation Error', error.message);
      return NextResponse.json(
        { error: 'Invalid email or password format' },
        { status: error.statusCode },
      );
    }

    // External API error (Supabase auth errors)
    if (error instanceof ExternalApiError) {
      log.error('Auth API: Authentication Error', error.message);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // General fallback error
    log.error('Auth API: Unexpected error', error.message);
    return NextResponse.json(
      { error: 'Authentication failed. Please try again later.' },
      { status: 500 },
    );
  }
}
