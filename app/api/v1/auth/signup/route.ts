// app/api/v1/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { log } from '@/lib/log';
import { ValidationError, ExternalApiError } from '@/lib/errors';
import { usersService } from '@/modules/users/users.service';
import { signupSchema } from '@/modules/users/users.schema';

export async function POST(request: Request) {
  log.info('Auth API: Signup endpoint called...');

  try {
    const body = await request.json();

    // Input validation
    const validationResult = signupSchema.safeParse(body);
    // log.info('Recieved data', body);
    // log.error(validationResult.error?.message);
    if (!validationResult.success) {
      throw new ValidationError('Invalid input data');
    }

    // Process through auth service
    const authResponse = await usersService.signup(validationResult.data);

    log.info('Auth API: Signup successful');
    return NextResponse.json(
      {
        message: ' We’ve sent a verification link to your email address.',
        requiresEmailVerification: true, // Add this flag
        authResponse,
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Validation error
    if (error instanceof ValidationError) {
      log.error('Auth API: Validation Error in signup');
      return NextResponse.json(
        { error: 'Invalid input data. Please check your email and password.' },
        { status: error.statusCode },
      );
    }

    // External API error (Supabase auth errors)
    if (error instanceof ExternalApiError) {
      log.error('Auth API: Registration Error in signup', error);
      return NextResponse.json(
        { error: 'Registration failed. Email may already be in use.' },
        { status: 400 },
      );
    }

    // General fallback error
    log.error('Auth API: Unexpected error in signup');
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' },
      { status: 500 },
    );
  }
}
