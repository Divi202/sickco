// src/domains/health/repositories/symptomRepository.ts

import { createClient } from '@supabase/supabase-js';
import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';

// Initialize Supabase client (replace with your actual Supabase URL and anon key)
// In a real application, these would come from environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Repository for managing SymptomEntry data in Supabase.
 * This handles the direct interaction with the database.
 */
export const symptomRepository = {
  /**
   * Inserts a new symptom entry into the database.
   * @param data The data for the new symptom entry.
   * @returns The created SymptomEntry, including its generated ID and createdAt timestamp.
   */
  async create(data: CreateSymptomEntryDTO): Promise<SymptomEntry> {
    const { data: newEntry, error } = await supabase
      .from('symptom_entries') // This will be your Supabase table name
      .insert({ symptoms: data.symptoms })
      .select('*') // Select all columns to get the generated ID and createdAt
      .single();

    if (error) {
      console.error('Error creating symptom entry:', error);
      throw new Error(`Failed to create symptom entry: ${error.message}`);
    }

    // Ensure the returned data matches the SymptomEntry interface
    return {
      id: newEntry.id,
      symptoms: newEntry.symptoms,
      createdAt: new Date(newEntry.created_at), // Assuming Supabase returns 'created_at'
    };
  },

  /**
   * Retrieves a symptom entry by its ID.
   * @param id The ID of the symptom entry to retrieve.
   * @returns The SymptomEntry if found, otherwise null.
   */
  async getById(id: string): Promise<SymptomEntry | null> {
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means "no rows found"
      console.error('Error fetching symptom entry by ID:', error);
      throw new Error(`Failed to fetch symptom entry: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      symptoms: data.symptoms,
      createdAt: new Date(data.created_at),
    };
  },
};
