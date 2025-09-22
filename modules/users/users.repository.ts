// modules/auth/auth.repository.ts
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/log';
import { ExternalApiError } from '@/lib/errors';
import { LoginInput, SignupInput, ResetPasswordInput } from '@/modules/users/users.schema';

export const usersRepository = {
  async login(credentials: LoginInput) {
    const supabase = await createClient();
    log.info('Users Repository: Attempting user login...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      log.error('Users Repository: Login failed');
      throw new ExternalApiError(`Authentication failed: ${error.message}`);
    }

    if (!data.user) {
      throw new ExternalApiError('No user data returned from authentication');
    }

    log.info('Users Repository: User login successful');
    return data;
  },

  async signup(userData: SignupInput) {
    const supabase = await createClient();
    log.info('Users Repository: Attempting user signup...');

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      log.error('Users Repository: Signup failed');
      throw new ExternalApiError(`Registration failed: ${error.message}`);
    }

    if (!data.user) {
      throw new ExternalApiError('No user data returned from registration');
    }

    log.info('Users Repository: User signup successful');
    return data;
  },

  async getCurrentUser() {
    const supabase = await createClient();
    log.info('Users Repository: Fetching current user...');

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      log.error('Users Repository: Failed to get current user');
      throw new ExternalApiError(`Failed to get user: ${error.message}`);
    }

    if (!data.user) {
      throw new ExternalApiError('No authenticated user found');
    }

    log.info('Users Repository: Current user fetched successfully');
    return data;
  },

  async logout() {
    const supabase = await createClient();
    log.info('Users Repository: Attempting user logout...');

    const { error } = await supabase.auth.signOut();

    if (error) {
      log.error('Users Repository: Logout failed');
      throw new ExternalApiError(`Logout failed: ${error.message}`);
    }

    log.info('Users Repository: User logout successful');
    return { success: true };
  },

  async resetPassword(email: ResetPasswordInput) {
    const supabase = await createClient();
    log.info('Users Repository: Attempting password reset...');

    const { error } = await supabase.auth.resetPasswordForEmail(email.email);

    if (error) {
      log.error('Users Repository: Password reset failed');
      throw new ExternalApiError(`Password reset failed: ${error.message}`);
    }

    log.info('Users Repository: Password reset email sent successfully');
    return { success: true };
  },
};
