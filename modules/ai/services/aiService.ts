/**
 * AI Service
 * 
 * Handles all AI/LLM interactions and business logic
 */

import { AIAnalysisRequest, AIAnalysisResponse, CreateAIAnalysisDTO } from '../models/AIResponse';
import { llmClient } from '../clients/llmClient';

export const aiService = {
  /**
   * Analyzes symptoms using AI/LLM and returns structured health insights
   * @param data The symptom data to analyze
   * @returns AI analysis response
   */
  async analyzeSymptoms(data: CreateAIAnalysisDTO): Promise<AIAnalysisResponse> {
    // Validation
    if (!data.symptoms || data.symptoms.trim().length === 0) {
      throw new Error('Symptoms are required for AI analysis');
    }

    if (data.symptoms.length > 2000) {
      throw new Error('Symptom description is too long (max 2000 characters)');
    }

    try {
      // Prepare the request for the LLM
      const analysisRequest: AIAnalysisRequest = {
        symptoms: data.symptoms.trim(),
        userId: data.userId,
      };

      // Call the LLM client
      const aiResponse = await llmClient.generateHealthAnalysis(analysisRequest);

      return aiResponse;
    } catch (error: any) {
      console.error('Error in AI service analysis:', error);
      throw new Error(`Failed to get AI analysis: ${error.message || 'Unknown error'}`);
    }
  },
};