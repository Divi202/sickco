// src/domains/health/services/symptomService.ts

import { symptomRepository } from '../repositorys/symptomRepository';
import { SymptomEntry, CreateSymptomEntryDTO } from '../models/SymptomEntry';

/**
 * Domain Service for handling business logic related to Symptom Entries.
 * This orchestrates operations and applies domain rules.
 */
export const symptomService = {
  /**
   * Creates a new symptom entry.
   * This is where you might add validation or other business rules before persistence.
   * @param data The data for the new symptom entry.
   * @returns The created SymptomEntry.
   */
  async createSymptomEntry(data: CreateSymptomEntryDTO): Promise<SymptomEntry> {
    // Example: Basic validation
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      throw new Error('Symptom description cannot be empty.');
    }

    // You could add more complex validation here, e.g., checking for profanity,
    // or ensuring the input is within a certain length.

    const newEntry = await symptomRepository.create(data);
    return newEntry;
  },

  /**
   * Retrieves a symptom entry by its ID.
   * @param id The ID of the symptom entry.
   * @returns The SymptomEntry if found, otherwise null.
   */
  async getSymptomEntryById(id: string): Promise<SymptomEntry | null> {
    return symptomRepository.getById(id);
  },
};
