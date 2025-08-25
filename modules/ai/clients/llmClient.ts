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

import OpenAI from 'openai';
import { AIAnalysisRequest, AIAnalysisResponse } from '../models/AIResponse';

/**
 * LLM Client Object
 *
 * Provides methods for interacting with Large Language Model APIs.
 * Currently supports health symptom analysis through OpenRouter.
 */
export const llmClient = {
  /**
   * Generates health analysis using AI/LLM based on user symptoms
   *
   * Sends symptom data to the configured LLM (via OpenRouter) and processes
   * the response into a structured format. Handles authentication, request
   * formatting, and response parsing.
   *
   * @param {AIAnalysisRequest} request - The analysis request containing symptoms
   * @returns {Promise<AIAnalysisResponse>} Structured AI analysis response
   *
   * @throws {Error} When API key is missing or API call fails
   *
   * @example
   * ```typescript
   * const response = await llmClient.generateHealthAnalysis({
   *   symptoms: "I have a headache and feel tired",
   *   userId: "user123"
   * });
   * console.log(response.analysis); // AI's health analysis
   * ```
   */
  async generateHealthAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
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
      defaultHeaders: {
        'HTTP-Referer': appUrl, // Required for OpenRouter
        'X-Title': 'SickCo - Sickness Companion', // App identification
      },
    });

    try {
      console.log('Requesting AI analysis for symptoms:', request.symptoms);

      // Make API call to OpenRouter using OpenAI SDK
      const chatCompletion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b:free', // Free model from OpenRouter
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful health assistant. Analyze the provided symptoms and give a concise analysis, a confidence score (0-1), a list of recommendations, and an urgency level (low, medium, high, emergency). Respond ONLY with a JSON object containing the keys: 'analysis' (string), 'confidence' (number), 'recommendations' (array of strings), and 'urgencyLevel' (string: 'low', 'medium', 'high', 'emergency'). Always include a disclaimer that this is not professional medical advice.",
          },
          {
            role: 'user',
            content: request.symptoms,
          },
        ],
        temperature: 0.7, // Balanced creativity vs consistency
        max_tokens: 500, // Reasonable response length
        response_format: { type: 'json_object' }, // Ensure JSON response
      });

      // Extract and parse the AI response
      const aiContentString = chatCompletion.choices[0].message.content;
      if (!aiContentString) {
        throw new Error('No content received from AI model.');
      }

      const aiContent = JSON.parse(aiContentString);

      // Validate required fields in AI response
      if (!aiContent.analysis || !aiContent.recommendations || !aiContent.urgencyLevel) {
        throw new Error('AI response missing required fields.');
      }

      // Map AI response to our interface
      return {
        id: `ai-analysis-${Date.now()}`,
        analysis: aiContent.analysis,
        confidence: aiContent.confidence || 0.8, // Default confidence if not provided
        recommendations: Array.isArray(aiContent.recommendations) ? aiContent.recommendations : [],
        urgencyLevel: aiContent.urgencyLevel,
        createdAt: new Date(),
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

      throw new Error(`Failed to get AI analysis: ${error.message || 'Unknown error'}`);
    }
  },
};
