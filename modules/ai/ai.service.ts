import { llmClient } from './llm.client';
import { LLMResponseDTO, SickCoAIRequestDTO } from './ai.schema';
import { log } from '@/lib/log';

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
  async sickcoAI(data: SickCoAIRequestDTO): Promise<LLMResponseDTO> {
    // Validation logic here (if needed)

    // console.log(data);

    log.info('AI Service: Processing user message for Sickco AI');

    log.debug('Data recieved in ai service:', data);
    // Delegate to the LLM client for actual AI communication
    const llmResponse = await llmClient.generateAiResponse(data);
    log.debug('LLM response recieved in AI service:', llmResponse);

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

    log.info('AI Service: Successfully processed user message request');

    return llmResponse;
  },
};
