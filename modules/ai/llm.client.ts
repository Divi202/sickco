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
  // Main function to generate SickCo AI response
  async generateAiResponse(request: SickCoAIRequestDTO): Promise<LLMResponseDTO> {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

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

    // System prompt to set the context for the conversation
    const systemPrompt = fs.readFileSync('modules/ai/prompts/system.prompt.md', 'utf8');

    if (!systemPrompt) {
      throw new ExternalApiError('System prompt file not found or is empty.');
    }

    // Field-specific validator
    function isValidContent(
      text: string,
      field: 'information' | 'empathy' | 'followUpQuestion' | 'disclaimer',
    ) {
      if (!text) return false;
      const trimmed = text.trim();

      // Check for only dots or repeated punctuation
      const dotsPattern = /^[.\s]+$/;
      if (dotsPattern.test(trimmed)) return false;

      // Length check
      if (trimmed.length < 10) return false;

      // Enhanced instruction leakage detection
      const instructionPatterns = [
        /reminder:/i,
        /thanks for the reminder/i,
        /i'll make sure/i,
        /every response/i,
        /json object/i,
        /structured output/i,
        /instructions/i,
        /system/i,
        /oops.*typo/i,
        /i am.*ai/i,
        /as an ai/i,
        /my role/i,
        /i will respond/i,
        /clean json/i,
        /warm.*content/i,
        /got it!/i,
        /i understand.*rules/i,
        /i'll stick to/i,
        /tidy json/i,
        /every reply/i,
      ];

      if (instructionPatterns.some((regex) => regex.test(trimmed))) {
        log.warn(`Instruction leakage detected in ${field}:`, trimmed.substring(0, 100));
        return false;
      }

      // Generic AI reasoning check (skip disclaimer)
      if (field !== 'disclaimer') {
        const reasoningPatterns = [
          /step \d+/i,
          /let's/i,
          /first,/i,
          /my response will/i,
          /i need to/i,
        ];
        if (reasoningPatterns.some((regex) => regex.test(trimmed))) return false;
      }

      return true;
    }

    try {
      log.info('LLM Client: Requesting response from AI');

      // Make API call to OpenRouter using OpenAI SDK
      const chatCompletion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b', // Free model from OpenRouter
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.userMessage },
        ],
        temperature: 0.3, // Balanced creativity vs consistency
        max_completion_tokens: 800, // Reasonable response length
        response_format: zodResponseFormat(LLMResponseDTO, 'sickco_response'),
      });

      const sickcoResponse = chatCompletion.choices[0].message.content;

      log.debug('AI response received from LLM');

      if (!sickcoResponse) {
        throw new ExternalApiError('AI response content is null');
      }

      let parsedResponse: LLMResponseDTO | null = null;
      // Parse JSON
      try {
        parsedResponse = JSON.parse(sickcoResponse);
      } catch (err) {
        throw new ExternalApiError('AI response could not be parsed as JSON.');
      }

      // Validate content
      if (
        !parsedResponse ||
        !isValidContent(parsedResponse.information, 'information') ||
        !isValidContent(parsedResponse.followUpQuestion, 'followUpQuestion') ||
        !isValidContent(parsedResponse.empathy, 'empathy') ||
        !isValidContent(parsedResponse.disclaimer, 'disclaimer')
      ) {
        throw new ExternalApiError('AI response contains invalid content.');
      }

      log.info('LLM Client: Successfully Proceeded');
      return parsedResponse!;
    } catch (error: any) {
      throw error;
    }
  },
};
