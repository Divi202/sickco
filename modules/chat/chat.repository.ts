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
  async create(request: ChatRequestDTO) {
    // Initialize Supabase client for database operations
    const supabase = await createClient();
    log.info('Chat Repository: Stroing user data in the database...');

    const { data: newEntry, error } = await supabase
      .from('chat_entries') // Supabase table name
      .insert({ user_message: request.userMessage, ai_response: null })
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
      disclamier: request.disclaimer,
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
};
