// app/module/health/repositorys/symptomRepository.ts
import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type

/**
 * Repository for managing SymptomEntry data in Supabase.
 * This handles the direct interaction with the database.
 */
export const symptomRepository = {
  /**
   * Inserts a new symptom entry into the database.
   * @param supabase The Supabase client instance.
   * @param data The data for the new symptom entry.
   * @returns The created SymptomEntry, including its generated ID and createdAt timestamp.
   */
  async create(supabase: SupabaseClient, data: CreateSymptomEntryDTO): Promise<SymptomEntry> {
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
   * @param supabase The Supabase client instance.
   * @param id The ID of the symptom entry to retrieve.
   * @returns The SymptomEntry if found, otherwise null.
   */
  async getById(supabase: SupabaseClient, id: string): Promise<SymptomEntry | null> {
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
