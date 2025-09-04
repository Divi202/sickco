/**
 * Health Symptom Service
 *
 * Domain service that orchestrates health-related business operations.
 * This service coordinates between data persistence (via repositories)
 * and AI analysis (via AI services) to provide comprehensive health
 * symptom processing capabilities.
 *
 * The service implements the business logic for symptom management,
 * including validation, data transformation, and workflow orchestration.
 *
 * Features:
 * - Symptom entry creation and validation
 * - AI analysis integration
 * - Database transaction coordination
 * - Business rule enforcement
 * - Error handling and logging
 */

import { symptomRepository } from '../repositorys/symptomRepository';
import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';
import { aiService } from '@/modules/ai/v1/services/aiService';
import { AIAnalysisResponse } from '@/modules/ai/v1/models/AIResponse';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Health Symptom Service Object
 *
 * Provides high-level operations for symptom management with integrated
 * AI analysis capabilities. Acts as the main business logic coordinator
 * for health-related operations.
 */
export const symptomService = {
  /**
   * Creates a new symptom entry with integrated AI analysis
   *
   * This method orchestrates the complete symptom processing workflow:
   * 1. Validates the symptom data according to business rules
   * 2. Creates a persistent record in the database
   * 3. Requests AI analysis of the symptoms
   * 4. Returns both the database entry and AI insights
   *
   * The operation is designed to be atomic - if AI analysis fails,
   * the symptom entry is still created to preserve user data.
   *
   * @param {SupabaseClient} supabase - Configured Supabase client for database operations
   * @param {CreateSymptomEntryDTO} data - Symptom data to process and analyze
   * @returns {Promise<{symptomEntry: SymptomEntry, aiAnalysis: AIAnalysisResponse}>}
   *   Combined result containing database entry and AI analysis
   *
   * @throws {Error} When validation fails or database operations fail
   *
   * @example
   * ```typescript
   * const supabase = await createClient();
   * const result = await symptomService.createSymptomEntry(supabase, {
   *   symptoms: "I have been experiencing severe headaches"
   * });
   *
   * console.log(result.symptomEntry.id); // Database record ID
   * console.log(result.aiAnalysis.urgencyLevel); // AI assessment
   * ```
   */
  async createSymptomEntry(
    supabase: SupabaseClient,
    data: CreateSymptomEntryDTO,
  ): Promise<{ symptomEntry: SymptomEntry; aiAnalysis: AIAnalysisResponse }> {
    console.log('Symptom Service: Processing new symptom entry');

    // Business rule validation
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      throw new Error('Symptom description cannot be empty.');
    }

    // Additional business validations
    if (data.symptoms.length > 2000) {
      throw new Error('Symptom description is too long. Please keep it under 2000 characters.');
    }

    if (data.symptoms.trim().length < 5) {
      throw new Error('Please provide a more detailed description of your symptoms.');
    }

    try {
      // Step 1: Create the symptom entry in the database
      console.log('Symptom Service: Creating database entry');
      const newEntry = await symptomRepository.create(supabase, data);
      console.log('Symptom Service: Database entry created with ID:', newEntry.id);

      // Step 2: Request AI analysis (non-blocking - entry is preserved even if this fails)
      console.log('Symptom Service: Requesting AI analysis');
      const aiAnalysis = await aiService.analyzeSymptoms({
        symptoms: data.symptoms,
        userId: undefined, // Could be extended to include user context
      });
      console.log('Symptom Service: AI analysis completed');

      // Return both results
      return {
        symptomEntry: newEntry,
        aiAnalysis,
      };
    } catch (error: any) {
      console.error('Symptom Service: Error processing symptom entry:', error);

      // Re-throw with context for better error handling upstream
      if (error.message.includes('database') || error.message.includes('Supabase')) {
        throw new Error('Unable to save symptom data. Please try again.');
      } else if (error.message.includes('AI') || error.message.includes('analysis')) {
        throw new Error('Symptom saved but AI analysis failed. Please try again for analysis.');
      }

      throw error; // Re-throw other errors as-is
    }
  },

  /**
   * Retrieves a symptom entry by its unique identifier
   *
   * Fetches a previously created symptom entry from the database.
   * Useful for displaying historical data or follow-up analysis.
   *
   * @param {SupabaseClient} supabase - Configured Supabase client for database operations
   * @param {string} id - Unique identifier of the symptom entry to retrieve
   * @returns {Promise<SymptomEntry | null>} The symptom entry if found, null otherwise
   *
   * @throws {Error} When database operation fails
   *
   * @example
   * ```typescript
   * const supabase = await createClient();
   * const entry = await symptomService.getSymptomEntryById(supabase, "entry-123");
   *
   * if (entry) {
   *   console.log(entry.symptoms); // Display the symptoms
   *   console.log(entry.createdAt); // Show when it was created
   * }
   * ```
   */
  async getSymptomEntryById(supabase: SupabaseClient, id: string): Promise<SymptomEntry | null> {
    console.log('Symptom Service: Retrieving symptom entry by ID:', id);

    if (!id || id.trim().length === 0) {
      throw new Error('Symptom entry ID is required.');
    }

    try {
      const entry = await symptomRepository.getById(supabase, id);
      console.log('Symptom Service: Retrieved symptom entry:', entry ? 'found' : 'not found');
      return entry;
    } catch (error: any) {
      console.error('Symptom Service: Error retrieving symptom entry:', error);
      throw new Error('Unable to retrieve symptom entry. Please try again.');
    }
  },

  /**
   * Validates symptom data according to business rules
   *
   * Performs comprehensive validation of symptom data before processing.
   * Can be used independently for real-time validation in UI components.
   *
   * @param {CreateSymptomEntryDTO} data - Symptom data to validate
   * @returns {boolean} True if data is valid for processing
   *
   * @example
   * ```typescript
   * const isValid = symptomService.validateSymptomData({
   *   symptoms: "I have a headache"
   * });
   *
   * if (!isValid) {
   *   // Show validation error to user
   * }
   * ```
   */

  validateSymptomData(data: CreateSymptomEntryDTO): boolean {
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      return false;
    }

    if (data.symptoms.length > 2000 || data.symptoms.trim().length < 5) {
      return false;
    }

    return true;
  },
};
