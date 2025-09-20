// modules/chat/chat.repository.ts
import { ChatResponseDTO } from './chat.schema';
/**
 * Chat Repository
 *
 * Data access layer for managing Chat messages entities in the database.
 * This repository handles all direct database interactions for chat relatd data,
 * providing a clean abstraction over Supabase operations.
 *
 * The repository follows the Repository pattern, isolating data access logic
 * from business logic and providing a consistent interface for data operations.
 *
 * Features:
 * - CRUD operations for chat messages
 * - Error handling and logging
 * - Data transformation between database and domain models
 * - Type-safe database operations
 * - Supabase integration
 */

import { ChatRequestDTO } from '../chat/chat.schema';
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/log';
import { DbError } from '@/lib/errors';
/**
 * Chat Repository Object
 *
 * Provides data access methods for chat entities with proper error handling
 * and data transformation. Acts as the single source of truth for chat-realted
 * data operations.
 */

export const chatRepository = {
  // Create a new chat entry
  async create(request: ChatRequestDTO, userId: string) {
    // MODIFIED: Added userId parameter
    // Initialize Supabase client for database operations
    const supabase = await createClient();
    log.info('Chat Repository: Stroing user data in the database...');

    const { data: newEntry, error } = await supabase
      .from('chat_entries') // Supabase table name
      .insert({ user_message: request.userMessage, ai_response: null, user_id: userId }) // MODIFIED: Added user_id
      .select('*')
      .single();

    if (error) {
      log.debug(error.message);
      throw new DbError('Database error while creating chat message entry');
    }

    if (!newEntry) {
      // log.debug(newEntry);
      throw new DbError('No data returned from database after creating chat message entry');
    }

    // log.debug('Chat Repository: Successfully created Chat message entry with ID:', newEntry.id);

    log.info('Chat Repository: Successfully Processed.');

    // retrun db chat entry id
    return newEntry.id;
  },

  // Update the chat entry with the ai response
  async update(request: ChatResponseDTO) {
    // Initialize Supabase client for database operations
    const supabase = await createClient();
    log.info('Chat Repository: Updating the chat entry to store the ai response');

    const aiResponseJson = {
      empathy: request.empathy,
      information: request.information,
      disclaimer: request.disclaimer,
      followUpQuestion: request.followUpQuestion,
    };
    const { data, error } = await supabase
      .from('chat_entries')
      .update({ ai_response: aiResponseJson })
      .eq('id', request.id)
      .select('id')
      .single();

    if (error) {
      log.debug('Error message: ', error.message);
      throw new DbError('Database error while saving ai response in the chat entry');
    }

    // log.debug(data.id);

    if (!data) {
      throw new DbError('No data returned from database after saving the ai response');
    }

    log.info('Chat Repository: Successfully save the ai response in the chat entry');

    // retrun db chat entry id
    return data.id;
  },

  // NEW: Function to get chat history for a user
  async getChatHistory(userId: string) {
    const supabase = await createClient();
    log.info(`Chat Repository: Fetching chat history for user ${userId}...`);

    const { data, error } = await supabase
      .from('chat_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false) // Filter out soft-deleted chats
      .order('created_at', { ascending: true }); // Order by creation time

    if (error) {
      log.error('Chat Repository: Failed to fetch chat history');
      throw new DbError('Database error while fetching chat history');
    }

    log.info(`Chat Repository: Successfully fetched chat history for user ${userId}`);
    return data;
  },

  // NEW: Function to mark all chats for a user as deleted (soft delete)
  async markChatsAsDeleted(userId: string) {
    const supabase = await createClient();
    log.info(`Chat Repository: Marking chats as deleted for user ${userId}...`);

    const { error } = await supabase
      .from('chat_entries')
      .update({ is_deleted: true })
      .eq('user_id', userId);

    if (error) {
      log.error('Chat Repository: Failed to mark chats as deleted');
      throw new DbError('Database error while marking chats as deleted');
    }

    log.info(`Chat Repository: Successfully marked chats as deleted for user ${userId}`);
    return { success: true };
  },
};
