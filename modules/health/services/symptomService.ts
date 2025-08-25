// src/domains/health/services/symptomService.ts

import { symptomRepository } from '../repositorys/symptomRepository';
import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';
import { aiService } from '@/modules/ai/services/aiService'; // Import the new AI service
import { AIAnalysisResponse } from '@/modules/ai/models/AIResponse'; // Import AI response type
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient type

/**
 * Domain Service for handling business logic related to Symptom Entries.
 * This orchestrates operations and applies domain rules.
 */
export const symptomService = {
  /**
   * Creates a new symptom entry and gets AI analysis.
   * @param supabase The Supabase client instance.
   * @param data The data for the new symptom entry.
   * @returns An object containing the created SymptomEntry and the AIAnalysisResponse.
   */
  async createSymptomEntry(supabase: SupabaseClient, data: CreateSymptomEntryDTO): Promise<{ symptomEntry: SymptomEntry, aiAnalysis: AIAnalysisResponse }> {
    // Example: Basic validation
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      throw new Error('Symptom description cannot be empty.');
    }

    // 1. Create the symptom entry in the database
    const newEntry = await symptomRepository.create(supabase, data);

    // 2. Call the AI service for analysis
    const aiAnalysis = await aiService.analyzeSymptoms({ symptoms: data.symptoms });

    // You could add more complex validation here, e.g., checking for profanity,
    // or ensuring the input is within a certain length.

    // Return both the created symptom entry and the AI analysis
    return { symptomEntry: newEntry, aiAnalysis };
  },

  /**
   * Retrieves a symptom entry by its ID.
   * @param supabase The Supabase client instance.
   * @param id The ID of the symptom entry.
   * @returns The SymptomEntry if found, otherwise null.
   */
  async getSymptomEntryById(supabase: SupabaseClient, id: string): Promise<SymptomEntry | null> {
    return symptomRepository.getById(supabase, id);
  },
};