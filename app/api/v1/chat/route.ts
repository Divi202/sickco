import { ChatRequestDTO, ChatResponseDTO } from '@/modules/chat/chat.schema';
import { chatService } from '@/modules/chat/chat.service';
import { NextResponse } from 'next/server';

// Docstring for this file code

/**
 * Chat API Route
 *
 * Next.js API route handler for processing user input submissions.
 * This endpoint receives user input from the frontend, processes
 * them through the chat service layer, and returns Sickco AI response.
 *
 * Features:
 * - Input validation and sanitization
 * - Integration with Chat and AI services
 * - Proper error handling and HTTP status codes
 * - Structured JSON responses
 *
 * @route POST /api/health/symptoms
 *
 * --------------------------------------------------------------------------
 * POST Handler for user input submission
 *
 * Processes incoming user input and returns Sickco AI response
 * The handler validates input, creates database entries, and coordinates with
 * AI services to provide comprehensive responses.
 *
 * @param {Request} request - The incoming HTTP request containing user input data
 * @returns {Promise<NextResponse>} JSON response with AI response.
 *
 * @example
 * Request body:
 * ```json
 * {
 *   "userInput": "I have been experiencing headaches and fatigue for the past few days"
 * }
 * ```
 *
 * Response:
 * ```json
 * {
 *   "aiResponse": {
 *     "id": "ai-analysis-123",
 *     "response": {
 *                 "empthay" : " ",
 *                 "info" : " ",
 *                 "disclaimer" : " ",
 *                 "followUpQuestion" : " ",
 *                 }
 *   }
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const { message }: ChatRequestDTO = await request.json();

    // Input data validation

    const validationResult = ChatRequestDTO.safeParse({ message });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 },
      );
    }
    // Process the valid input through the chat service
    // const aiResponse: ChatResponseDTO | undefined = await chatService.processMessage({ message });

    // ui integration testing
    const aiResponse = {
      empathy:
        "I'm sorry to hear that you're experiencing headaches and fatigue. It must be quite uncomfortable.",
      information:
        'Headaches and fatigue can be symptoms of various conditions, including stress, dehydration, or more serious health issues. It is important to monitor your symptoms and consider any other accompanying signs.',
      disclaimer: ' Please note that I am an AI language model and not a medical professional',
      followUpQuestion:
        'Have you experienced any other symptoms, such as fever, nausea, or changes in vision?',
    };

    // Return both the symptom entry details and the AI analysis
    return NextResponse.json(aiResponse, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/v1/chat:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
