import OpenAI from 'openai';
import { LLMResponseDTO, SickCoAIRequestDTO } from './ai.schema';
import fs from 'fs';
import { zodResponseFormat } from 'openai/helpers/zod';
import { log } from '@/lib/log';
import { ExternalApiError } from '@/lib/errors';
/**
 * Large Language Model (LLM) Client
 *
 * This module handles direct communication with Large Language Model APIs.
 * Currently configured to work with OpenRouter API using the OpenAI SDK,
 * providing access to various AI models including open-source options.
 *
 * The client abstracts the complexity of API communication and provides
 * a clean interface for the AI service layer to consume.
 *
 * Features:
 * - OpenRouter API integration using OpenAI SDK
 * - Structured JSON response parsing
 * - Error handling and retry logic
 * - Environment-based configuration
 * - Support for multiple AI models
 */

/**
 * LLM Client Object
 *
 * Provides methods for interacting with Large Language Model APIs.
 * Currently supports health symptom analysis through OpenRouter.
 */
export const llmClient = {
  // Main fucntion to generate SickCo AI response
  async generateAiResponse(request: SickCoAIRequestDTO): Promise<LLMResponseDTO> {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    // const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sickco-app.com';

    if (!openRouterApiKey) {
      throw new ExternalApiError(
        'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your environment variables.',
      );
    }

    // Initialize OpenAI client with OpenRouter configuration
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterApiKey,
    });

    // Systme prompt to set the context for the conversation
    // Read the markdown file
    const systemPrompt = fs.readFileSync('modules/ai/prompts/system.prompt.md', 'utf8');

    if (!systemPrompt) {
      throw new ExternalApiError('System prompt file not found or is empty.');
    }

    try {
      log.info('LLM Client: Requesting response from AI');

      // Make API call to OpenRouter using OpenAI SDK
      const chatCompletion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b', // Free model from OpenRouter
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: request.userMessage,
          },
        ],

        temperature: 0.7, // Balanced creativity vs consistency
        max_completion_tokens: 5000, // Reasonable response length
        response_format: zodResponseFormat(LLMResponseDTO, 'sickco_response'),
      });

      // Validate required fields in AI response
      // if (!aiContent.information || !aiContent.followUpQuestion) {
      //   throw new Error('AI response missing required fields.');
      // }
      // Get the response content
      // log.debug('Content returned inside chat completion:', chatCompletion);
      const sickcoResponse = chatCompletion.choices[0].message.content;

      log.debug('AI response received from LLM');

      if (!sickcoResponse) {
        throw new ExternalApiError('AI response content is null');
      }

      const parsedResponse = JSON.parse(sickcoResponse);

      // You can access specific fields from the parsed JSON
      // For example, if the response has a 'response' field:

      // handle edge case where LLM respone with refusal (refuse to answer)
      log.info('LLM Client: Successfully Proceeded');
      return parsedResponse;
    } catch (error: any) {
      throw error;
    }
  },
};
