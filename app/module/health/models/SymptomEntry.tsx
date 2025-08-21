// src/domains/health/models/SymptomEntry.ts

/**
 * Represents a single symptom entry provided by a user.
 * This is an Entity in DDD, as its identity (id) is crucial.
 */
export interface SymptomEntry {
  id: string; // Unique identifier for the symptom entry (your "serial number")
  symptoms: string; // The user's description of symptoms
  createdAt: Date; // Timestamp when the entry was created
}

/**
 * Represents the data required to create a new SymptomEntry.
 * This is a Value Object or DTO (Data Transfer Object).
 */
export interface CreateSymptomEntryDTO {
  symptoms: string;
}
