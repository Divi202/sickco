/**
 * AI Service
 * 
 * Business logic layer for AI/LLM interactions. This service orchestrates
 * AI operations, handles validation, and provides a clean interface for
 * other parts of the application to consume AI capabilities.
 * 
 * The service acts as a facade over the LLM client, adding business rules,
 * validation, and error handling specific to the application's needs.
 * 
 * Features:
 * - Input validation and sanitization
 * - Business rule enforcement
 * - Error handling and user-friendly messages
 * - Logging and monitoring hooks
 * - Rate limiting preparation
 */

import { AIAnalysisRequest, AIAnalysisResponse, CreateAIAnalysisDTO } from '../models/AIResponse';
import { llmClient } from '../clients/llmClient';

/**
 * AI Service Object
 * 
 * Provides high-level AI operations with business logic and validation.
 * Acts as the main interface for AI functionality across the application.
 */
export const aiService = {
  /**
   * Analyzes user symptoms using AI/LLM and returns structured health insights
   * 
   * This method handles the complete flow of symptom analysis including:
   * - Input validation and sanitization
   * - Business rule enforcement
   * - AI/LLM communication via the client
   * - Response processing and formatting
   * - Error handling with user-friendly messages
   * 
   * @param {CreateAIAnalysisDTO} data - The symptom data to analyze
   * @returns {Promise<AIAnalysisResponse>} Structured AI analysis with recommendations
   * 
   * @throws {Error} When validation fails or AI service is unavailable
   * 
   * @example
   * ```typescript
   * const analysis = await aiService.analyzeSymptoms({
   *   symptoms: "I have been experiencing headaches and fatigue",
   *   userId: "user123"
   * });
   * 
   * console.log(analysis.urgencyLevel); // 'low', 'medium', 'high', or 'emergency'
   * console.log(analysis.recommendations); // Array of actionable recommendations
   * ```
   */
  async analyzeSymptoms(data: CreateAIAnalysisDTO): Promise<AIAnalysisResponse> {
    // Input validation
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      throw new Error('Symptoms are required for AI analysis');
    }

    // Length validation to prevent abuse and ensure quality responses
    if (data.symptoms.length > 2000) {
      throw new Error('Symptom description is too long (max 2000 characters)');
    }

    // Minimum length validation for meaningful analysis
    if (data.symptoms.trim().length < 10) {
      throw new Error('Please provide a more detailed description of your symptoms (minimum 10 characters)');
    }

    // Basic content validation (could be expanded with more sophisticated checks)
    const sanitizedSymptoms = data.symptoms.trim();
    
    try {
      console.log('AI Service: Processing symptom analysis request');
      
      // Prepare the request for the LLM client
      const analysisRequest: AIAnalysisRequest = {
        symptoms: sanitizedSymptoms,
        userId: data.userId,
      };

      // Delegate to the LLM client for actual AI communication
      const aiResponse = await llmClient.generateHealthAnalysis(analysisRequest);

      // Post-process the response (could add business logic here)
      // For example: adjust urgency based on business rules, add disclaimers, etc.
      
      console.log('AI Service: Successfully processed symptom analysis');
      return aiResponse;
      
    } catch (error: any) {
      console.error('Error in AI service analysis:', error);
      
      // Transform technical errors into user-friendly messages
      if (error.message.includes('API quota exceeded')) {
        throw new Error('Our AI service is temporarily unavailable due to high demand. Please try again in a few minutes.');
      } else if (error.message.includes('API key')) {
        throw new Error('AI service is currently unavailable. Please contact support if this persists.');
      } else if (error.message.includes('model_not_found')) {
        throw new Error('AI analysis service is temporarily unavailable. Please try again later.');
      }
      
      // Generic fallback error message
      throw new Error(`Unable to analyze symptoms at this time: ${error.message || 'Please try again later'}`);
    }
  },
  
  /**
   * Validates symptom input according to business rules
   * 
   * This method can be used independently to validate symptom descriptions
   * before processing, useful for real-time validation in UI components.
   * 
   * @param {string} symptoms - The symptom description to validate
   * @returns {boolean} True if symptoms are valid for analysis
   * 
   * @example
   * ```typescript
   * const isValid = aiService.validateSymptoms("I have a headache");
   * if (!isValid) {
   *   // Show validation error to user
   * }
   * ```
   */
  validateSymptoms(symptoms: string): boolean {
    if (!symptoms || symptoms.trim().length === 0) {
      return false;
    }
    
    if (symptoms.length > 2000 || symptoms.trim().length < 10) {
      return false;
    }
    
    return true;
  },
};