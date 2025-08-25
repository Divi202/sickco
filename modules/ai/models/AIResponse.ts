/**
 * AI Response Models
 * 
 * Defines the structure for AI/LLM responses and related data types
 */

export interface AIAnalysisRequest {
  symptoms: string;
  userId?: string; // Optional for future user-specific context
}

export interface AIAnalysisResponse {
  id: string; // Unique identifier for this analysis
  analysis: string; // The AI's health analysis/recommendations
  confidence: number; // Confidence score (0-1)
  recommendations: string[]; // List of specific recommendations
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  createdAt: Date;
}

export interface CreateAIAnalysisDTO {
  symptoms: string;
  userId?: string;
}