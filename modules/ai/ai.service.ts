import { llmClient } from '../ai/llm.client';
import { SickCoAIRequestDTO, SickCoAIResponseDTO } from './ai.schema';
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

/**
 * AI Service Object
 *
 * Provides high-level AI operations with business logic and validation.
 * Acts as the main interface for AI functionality across the application.
 */
export const aiService = {
  async sickcoAI(data: SickCoAIRequestDTO): Promise<SickCoAIResponseDTO> {
    // Validation logic here (if needed)

    try {
      console.log('AI Service: Processing user message for Sickco AI');

      // Delegate to the LLM client for actual AI communication
      const llmResponse = await llmClient.generateAiResponse(data);

      // Mock resposne from llm
      //   const llmResponse = {
      //     id: 'ai-analysis-123',
      //     empathy: 'I understand that dealing with health issues can be challenging.',
      //     information: 'Hello I am Sickco AI. How can I help you today?',
      //     disclaimer:
      //       'Please note that this information is not a substitute for professional medical advice.',
      //     followUpQuestion: 'Can you provide more details about your symptoms?',
      //   };

      // Post-process the response (could add business logic here)
      // For example: adjust urgency based on business rules, add disclaimers, etc.

      console.log('AI Service: Successfully processed user message request');
      return llmResponse;
    } catch (error: any) {
      console.error('Error in SickCo AI response:', error);

      // Transform technical errors into user-friendly messages
      if (error.message.includes('API quota exceeded')) {
        throw new Error(
          'Our AI service is temporarily unavailable due to high demand. Please try again in a few minutes.',
        );
      } else if (error.message.includes('API key')) {
        throw new Error(
          'AI service is currently unavailable. Please contact support if this persists.',
        );
      } else if (error.message.includes('model_not_found')) {
        throw new Error('AI analysis service is temporarily unavailable. Please try again later.');
      }

      // Generic fallback error message
      throw new Error(
        `Unable to analyze symptoms at this time: ${error.message || 'Please try again later'}`,
      );
    }
  },
};
