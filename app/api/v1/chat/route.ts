import { UserInputDTO, UserInputDTOType } from '@/modules/chat/types/userInputDTO';
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
 *     "createdAt": "2024-01-01T00:00:00Z"
 *   }
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const { userInput }: UserInputDTOType = await request.json();

    // Input data validation
    const validationResult = UserInputDTO.safeParse({ userInput });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 },
      );
    }
    // Process the valid input through the chat service
    const aiResponse = await chatService.processUerInput(userInput);

    // Return both the symptom entry details and the AI analysis
    return NextResponse.json(aiResponse, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/v1/chat:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
