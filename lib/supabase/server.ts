/**
 * Supabase Server Client
 * 
 * This module provides server-side Supabase client creation for Next.js applications.
 * It handles cookie-based authentication and session management on the server side.
 * 
 * The client is configured to work with Next.js Server Components and API routes,
 * managing user sessions through HTTP cookies for secure server-side operations.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client configured for server-side usage
 * 
 * This function creates a Supabase client that can be used in Server Components,
 * API routes, and other server-side contexts. It automatically handles cookie
 * management for user authentication and session persistence.
 * 
 * The client uses the SSR package to ensure proper cookie handling between
 * client and server, maintaining user sessions across requests.
 * 
 * @returns {Promise<SupabaseClient>} A configured Supabase client for server-side use
 * 
 * @example
 * ```typescript
 * // In an API route or Server Component
 * const supabase = await createClient();
 * const { data, error } = await supabase.from('users').select('*');
 * ```
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are not set
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
