import { ChatRequestDTO, ChatResponseDTO } from '@/modules/chat/chat.schema';
import { chatService } from '@/modules/chat/chat.service';
import { NextResponse } from 'next/server';
import { log } from '@/lib/log';
import { DbError, ExternalApiError, ValidationError } from '@/lib/errors';

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
 *   "userMessage": "I have been experiencing headaches and fatigue for the past few days"
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
  log.info('Chat API called...'); // info log
  try {
    // Parse request body
    const { userMessage }: ChatRequestDTO = await request.json();

    // Input data validation
    const validationResult = ChatRequestDTO.safeParse({ userMessage });

    if (!validationResult.success) {
      throw new ValidationError('Invalid input');
    }

    // Process the valid input through the chat service
    const aiResponse: ChatResponseDTO | undefined = await chatService.processMessage({
      userMessage,
    });

    const sickcoResponseId = crypto.randomUUID(); // temp id to send frontend till we get it form the db

    // ui integration testing
    const fullAiResponse = {
      id: sickcoResponseId,
      information: aiResponse?.information,
      empathy: aiResponse?.empathy,
      disclaimer: aiResponse?.disclaimer,
      followUpQuestion: aiResponse?.followUpQuestion,
    };

    // Return ai response
    log.info('Chat API: Successfully send the SickCo resposne to the user.'); // info log
    return NextResponse.json(fullAiResponse, { status: 201 });
  } catch (error: any) {
    // Validation error
    if (error instanceof ValidationError) {
      log.error('Validation Error: ', error.message);
      return NextResponse.json(
        { error: 'Message is too big. (Lenght should be under 2000 words)' },
        { status: error.statusCode },
      );
    }
    // Database Error
    if (error instanceof DbError) {
      log.error('Database Error: ', error.message);
      return NextResponse.json(
        { error: 'Fails to save the data at the moment. Please try again later' },
        { status: error.statusCode },
      );
    }

    // This kind of error are only for developers.
    if (error instanceof ExternalApiError) {
      log.error('External API Error: ', error.message);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again later' },
        { status: error.statusCode },
      );
    }
    //General fallback error
    log.error('Error in /api/v1/chat', error.message); // error log
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later' },
      { status: 500 },
    );
  }
}
