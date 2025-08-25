// modules/ai/clients/llmClient.ts

import { AIAnalysisRequest, AIAnalysisResponse } from '../models/AIResponse';
import OpenAI from 'openai'; // Import the OpenAI SDK

export const llmClient = {
  /**
   * Simulates generating a health analysis from an LLM based on symptoms.
   * @param request The AI analysis request containing symptoms.
   * @returns A mock AI analysis response.
   */
  async generateHealthAnalysis(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app-domain.com'; // Your app's URL for HTTP-Referer

    if (!openRouterApiKey) {
      throw new Error(
        'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in your environment variables.',
      );
    }

    // Initialize OpenAI client, pointing to OpenRouter's base URL
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterApiKey,
      defaultHeaders: {
        'HTTP-Referer': appUrl, // Required for OpenRouter
        'X-Title': 'SickCo - Sickness Companion', // Optional: Your app's name for OpenRouter analytics
      },
    });

    try {
      // Use the chat completions API
      const chatCompletion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b:free', // Specify the model from OpenRouter
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful health assistant. Analyze the provided symptoms and give a concise analysis, a confidence score (0-1), a list of recommendations, and an urgency level (low, medium, high, emergency). Respond ONLY with a JSON object containing the keys: 'analysis' (string), 'confidence' (number), 'recommendations' (array of strings), and 'urgencyLevel' (string: 'low', 'medium', 'high', 'emergency').",
          },
          {
            role: 'user',
            content: request.symptoms,
          },
        ],
        temperature: 0.7, // Adjust as needed
        max_tokens: 500, // Adjust as needed
        response_format: { type: 'json_object' }, // Request JSON output
      });

      // Extract the content and parse the JSON
      const aiContentString = chatCompletion.choices[0].message.content;
      if (!aiContentString) {
        throw new Error('No content received from AI.');
      }
      const aiContent = JSON.parse(aiContentString);

      // Map the AI's response to your AIAnalysisResponse interface
      return {
        id: `ai-analysis-${Date.now()}`,
        analysis: aiContent.analysis,
        confidence: aiContent.confidence,
        recommendations: aiContent.recommendations,
        urgencyLevel: aiContent.urgencyLevel,
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error('Error calling OpenRouter API with OpenAI SDK:', error);
      throw new Error(`Failed to get AI analysis: ${error.message || 'Unknown error'}`);
    }
  },
};
