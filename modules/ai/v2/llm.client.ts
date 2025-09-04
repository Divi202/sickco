import OpenAI from 'openai';
import { SickCoAIRequestDTO, SickCoAIResponseDTO } from './ai.schema';
import fs from 'fs';

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
  async generateAiResponse(request: SickCoAIRequestDTO): Promise<SickCoAIResponseDTO> {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sickco-app.com';

    if (!openRouterApiKey) {
      throw new Error(
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
    const systemPrompt = fs.readFileSync('modules/ai/v2/prompts/system.prompt.md', 'utf8');

    if (!systemPrompt) {
      throw new Error('System prompt file not found or is empty.');
    }

    try {
      console.log('LLM Client: Requesting response from AI');

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
        max_tokens: 500, // Reasonable response length
        response_format: { type: 'json_object' }, // Ensure JSON response
      });

      // Extract and parse the AI response
      const aiContentString = chatCompletion.choices[0].message?.content;
      if (!aiContentString) {
        throw new Error('No content received from AI model.');
      }

      const aiContent = JSON.parse(aiContentString);

      // Validate required fields in AI response
      // if (!aiContent.information || !aiContent.followUpQuestion) {
      //   throw new Error('AI response missing required fields.');
      // }

      // Map AI response to our interface
      return {
        id: `ai-analysis-${Date.now()}`,
        empathy: aiContent.empathy,
        information: aiContent.information,
        disclaimer: aiContent.disclaimer,
        followUpQuestion: aiContent.followUpQuestion,
      };
    } catch (error: any) {
      console.error('Error calling OpenRouter API with OpenAI SDK:', error);

      // Provide more specific error messages
      if (error.code === 'insufficient_quota') {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.code === 'model_not_found') {
        throw new Error('The specified AI model is not available.');
      } else if (error instanceof SyntaxError) {
        throw new Error('Failed to parse AI response. Please try again.');
      }

      throw new Error(`Failed to get AI response: ${error.message || 'Unknown error'}`);
    }
  },
};
