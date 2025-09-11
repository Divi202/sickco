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
/**
 * Chat Repository Object
 *
 * Provides data access methods for chat entities with proper error handling
 * and data transformation. Acts as the single source of truth for chat-realted
 * data operations.
 */

export const chatRepository = {
  // Create a new chat message entry
  async create(message: ChatRequestDTO): Promise<String> {
    // Initialize Supabase client for database operations
    const supabase = await createClient();
    log.info('Chat Repository: Processing...');

    const { data: newEntry, error } = await supabase
      .from('chat_entries') // Supabase table name
      .insert({ user_message: message.userMessage, ai_response: null })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Database error while creating chat message entry: ${error.message}`);
    }

    if (!newEntry) {
      throw new Error('No data returned from database after creating chat message entry');
    }

    // console.log('Chat Repository: Successfully created Chat message entry with ID:', newEntry.id);

    log.info('Chat Repository: Successfully Processed.');

    return 'Message saved successfully in Database';
  },
};
