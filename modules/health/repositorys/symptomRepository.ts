/**
 * Symptom Repository
 * 
 * Data access layer for managing SymptomEntry entities in the database.
 * This repository handles all direct database interactions for symptom-related
 * data, providing a clean abstraction over Supabase operations.
 * 
 * The repository follows the Repository pattern, isolating data access logic
 * from business logic and providing a consistent interface for data operations.
 * 
 * Features:
 * - CRUD operations for symptom entries
 * - Error handling and logging
 * - Data transformation between database and domain models
 * - Type-safe database operations
 * - Supabase integration
 */

import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Symptom Repository Object
 * 
 * Provides data access methods for symptom entries with proper error handling
 * and data transformation. Acts as the single source of truth for symptom
 * data operations.
 */
export const symptomRepository = {
  /**
   * Creates a new symptom entry in the database
   * 
   * Inserts a new symptom record into the Supabase database and returns
   * the complete entry with generated ID and timestamp. Handles data
   * transformation between the DTO and the database schema.
   * 
   * @param {SupabaseClient} supabase - Configured Supabase client instance
   * @param {CreateSymptomEntryDTO} data - Symptom data to insert
   * @returns {Promise<SymptomEntry>} The created symptom entry with generated fields
   * 
   * @throws {Error} When database insertion fails or data is invalid
   * 
   * @example
   * ```typescript
   * const supabase = await createClient();
   * const newEntry = await symptomRepository.create(supabase, {
   *   symptoms: "I have been experiencing headaches"
   * });
   * 
   * console.log(newEntry.id); // Generated UUID
   * console.log(newEntry.createdAt); // Timestamp
   * ```
   */
  async create(supabase: SupabaseClient, data: CreateSymptomEntryDTO): Promise<SymptomEntry> {
    console.log('Symptom Repository: Creating new symptom entry');
    
    const { data: newEntry, error } = await supabase
      .from('symptom_entries') // Supabase table name
      .insert({ symptoms: data.symptoms })
      .select('*') // Return all columns including generated fields
      .single();

    if (error) {
      console.error('Error creating symptom entry:', error);
      throw new Error(`Database error while creating symptom entry: ${error.message}`);
    }

    if (!newEntry) {
      throw new Error('No data returned from database after creating symptom entry');
    }

    console.log('Symptom Repository: Successfully created symptom entry with ID:', newEntry.id);

    // Transform database record to domain model
    return {
      id: newEntry.id,
      symptoms: newEntry.symptoms,
      createdAt: new Date(newEntry.created_at), // Convert string to Date object
    };
  },

  /**
   * Retrieves a symptom entry by its unique identifier
   * 
   * Fetches a single symptom entry from the database using its ID.
   * Returns null if no entry is found with the given ID.
   * 
   * @param {SupabaseClient} supabase - Configured Supabase client instance
   * @param {string} id - Unique identifier of the symptom entry
   * @returns {Promise<SymptomEntry | null>} The symptom entry if found, null otherwise
   * 
   * @throws {Error} When database query fails (excluding "not found" cases)
   * 
   * @example
   * ```typescript
   * const supabase = await createClient();
   * const entry = await symptomRepository.getById(supabase, "entry-uuid");
   * 
   * if (entry) {
   *   console.log(`Found entry: ${entry.symptoms}`);
   * } else {
   *   console.log('Entry not found');
   * }
   * ```
   */
  async getById(supabase: SupabaseClient, id: string): Promise<SymptomEntry | null> {
    console.log('Symptom Repository: Fetching symptom entry by ID:', id);
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('id', id)
      .single();

    // Handle "no rows found" error (PGRST116) as a normal case
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching symptom entry by ID:', error);
      throw new Error(`Database error while fetching symptom entry: ${error.message}`);
    }

    // Return null if no data found
    if (!data) {
      console.log('Symptom Repository: No symptom entry found with ID:', id);
      return null;
    }

    console.log('Symptom Repository: Successfully retrieved symptom entry');

    // Transform database record to domain model
    return {
      id: data.id,
      symptoms: data.symptoms,
      createdAt: new Date(data.created_at),
    };
  },

  /**
   * Retrieves multiple symptom entries with pagination support
   * 
   * Fetches a list of symptom entries from the database with optional
   * pagination parameters. Useful for displaying symptom history.
   * 
   * @param {SupabaseClient} supabase - Configured Supabase client instance
   * @param {Object} options - Query options
   * @param {number} [options.limit=10] - Maximum number of entries to return
   * @param {number} [options.offset=0] - Number of entries to skip
   * @returns {Promise<SymptomEntry[]>} Array of symptom entries
   * 
   * @throws {Error} When database query fails
   * 
   * @example
   * ```typescript
   * const supabase = await createClient();
   * const entries = await symptomRepository.getMany(supabase, {
   *   limit: 20,
   *   offset: 0
   * });
   * 
   * console.log(`Found ${entries.length} symptom entries`);
   * ```
   */
  async getMany(
    supabase: SupabaseClient, 
    options: { limit?: number; offset?: number } = {}
  ): Promise<SymptomEntry[]> {
    const { limit = 10, offset = 0 } = options;
    
    console.log(`Symptom Repository: Fetching symptom entries (limit: ${limit}, offset: ${offset})`);
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .order('created_at', { ascending: false }) // Most recent first
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching symptom entries:', error);
      throw new Error(`Database error while fetching symptom entries: ${error.message}`);
    }

    if (!data) {
      console.log('Symptom Repository: No symptom entries found');
      return [];
    }

    console.log(`Symptom Repository: Successfully retrieved ${data.length} symptom entries`);

    // Transform database records to domain models
    return data.map(entry => ({
      id: entry.id,
      symptoms: entry.symptoms,
      createdAt: new Date(entry.created_at),
    }));
  },
};