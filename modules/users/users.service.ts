// modules/users/users.service.ts

import { log } from '@/lib/log';
import { ValidationError } from '@/lib/errors';
import {
  LoginInput,
  SignupInput,
  ResetPasswordInput,
  AuthResponseDTO,
  UserResponseDTO,
  UpdateProfileInput,
} from './users.schema';
import { usersRepository } from './users.repository';

export const usersService = {
  // Authentication methods
  async login(credentials: LoginInput): Promise<AuthResponseDTO> {
    log.info('Users Service: Processing login request...');
    log.debug('Login attempt for user');

    // Business validation logic
    if (!credentials.email || !credentials.password) {
      throw new ValidationError('Email and password are required');
    }

    try {
      const authData = await usersRepository.login(credentials);
      const { user, session } = authData;
      if (!user) throw new Error('Authentication returned no user'); // defensive
      
      const response: AuthResponseDTO = {
        user: {
          id: user.id,
          email: user.email!,
          created_at: user.created_at,
        },
        session: authData.session
          ? {
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at!,
            }
          : undefined,
      };
      log.info('Auth Service: Login successful');
      return response;
    } catch (error) {
      log.error('Users Service: Login failed');
      throw error;
    }
  },

  async signup(userData: SignupInput): Promise<AuthResponseDTO> {
    log.info('Users Service: Processing signup request...');
    log.debug('Signup attempt for user');

    // Business validation logic
    if (!userData.email || !userData.password) {
      throw new ValidationError('Email and password are required');
    }

    if (userData.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    try {
      const authData = await usersRepository.signup(userData);
      const { user, session } = authData;
      if (!user) throw new Error('Authentication returned no user'); // defensive

      const response: AuthResponseDTO = {
        user: { id: user.id, email: user.email!, created_at: user.created_at },
        session: session
          ? {
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at!,
            }
          : undefined,
      };
      log.info('Auth Service: Signup successful');
      return response;
    } catch (error) {
      log.error('Users Service: Signup failed');
      throw error;
    }
  },

  async getCurrentUser(): Promise<UserResponseDTO> {
    log.info('Users Service: Fetching current user...');

    try {
      const authData = await usersRepository.getCurrentUser();
      const { user } = authData;
      if (!user) throw new Error('Authentication returned no user'); // defensive
      const response: UserResponseDTO = {
        user: {
          id: user.id,
          email: user.email!,
          created_at: user.created_at,
        },
      };

      log.info('Auth Service: Current user fetched successfully');
      return response;
    } catch (error) {
      log.error('Users Service: Failed to get current user');
      throw error;
    }
  },

  async logout(): Promise<{ success: boolean }> {
    log.info('Users Service: Processing logout request...');
    try {
      const result = await usersRepository.logout();
      log.info('Auth Service: Logout successful');
      return result;
    } catch (error) {
      log.error('Users Service: Logout failed');
      throw error;
    }
  },

  async resetPassword(email: ResetPasswordInput): Promise<{ success: boolean }> {
    log.info('Users Service: Processing password reset request...');
    log.debug('Password reset request for user');

    // Business validation logic
    if (!email.email) {
      throw new ValidationError('Email is required for password reset');
    }

    try {
      const result = await usersRepository.resetPassword(email);
      log.info('Auth Service: Password reset email sent successfully');
      return result;
    } catch (error) {
      log.error('Users Service: Password reset failed');
      throw error;
    }
  },

  // �� Future user management methods
  async updateProfile(userId: string, data: UpdateProfileInput) {
    //: Promise<UserResponseDTO> (return data type)
    log.info('Users Service: Updating user profile...');
    // ... future implementation
  },

  async getUserPreferences(userId: string): Promise<any> {
    log.info('Users Service: Fetching user preferences...');
    // ... future implementation
  },
};
