/**
 * AI Response Models and Types
 * 
 * This module defines the data structures and types used for AI/LLM interactions
 * throughout the application. It includes request/response models and DTOs for
 * type-safe communication with AI services.
 * 
 * These models ensure consistent data structure across the AI module and provide
 * clear contracts for API interactions and data transformation.
 */

/**
 * Request structure for AI analysis
 * 
 * Defines the data required to request an AI analysis of health symptoms.
 * Used as input to the AI service for generating health insights.
 * 
 * @interface AIAnalysisRequest
 */
export interface AIAnalysisRequest {
  /** The user's description of their symptoms */
  symptoms: string;
  /** Optional user ID for personalized analysis (future feature) */
  userId?: string;
}

/**
 * Response structure from AI analysis
 * 
 * Defines the complete response structure returned by AI services after
 * analyzing user symptoms. Contains analysis, recommendations, and metadata.
 * 
 * @interface AIAnalysisResponse
 */
export interface AIAnalysisResponse {
  /** Unique identifier for this analysis session */
  id: string;
  /** The AI's detailed health analysis and insights */
  analysis: string;
  /** AI confidence score ranging from 0 to 1 */
  confidence: number;
  /** Array of specific actionable recommendations */
  recommendations: string[];
  /** Urgency level assessment for the symptoms */
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  /** Timestamp when the analysis was created */
  createdAt: Date;
}

/**
 * Data Transfer Object for creating AI analysis
 * 
 * Simplified structure used for initiating AI analysis requests.
 * Contains only the essential data needed to start the analysis process.
 * 
 * @interface CreateAIAnalysisDTO
 */
export interface CreateAIAnalysisDTO {
  /** The user's symptom description to analyze */
  symptoms: string;
  /** Optional user identifier for context */
  userId?: string;
}