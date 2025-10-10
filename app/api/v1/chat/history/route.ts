// app/api/v1/chat/history/route.ts
import { NextResponse } from 'next/server';
import { log } from '@/lib/log';
import { requireUser } from '@/lib/auth';
import { chatService } from '@/modules/chat/chat.service';
import { ExternalApiError } from '@/lib/errors';

/**
 * Chat History API Route
 *
 * Next.js API route handler for fetching a user's chat history.
 * This endpoint retrieves all non-deleted chat entries for the authenticated user.
 *
 * @route GET /api/v1/chat/history
 *
 * --------------------------------------------------------------------------
 * GET Handler for fetching chat history
 *
 * Authenticates the user and retrieves their past chat messages and AI responses.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response with the user's chat history.
 *
 * @example
 * Response:
 * ```json
 * [
 *   {
 *     "id": "chat-entry-uuid-1",
 *     "user_message": "I have a headache.",
 *     "ai_response": {
 *       "empathy": "I understand...",
 *       "information": "Headaches can be caused by...",
 *       "disclaimer": "This is not medical advice.",
 *       "followUpQuestion": "Are you experiencing any other symptoms?"
 *     },
 *     "user_id": "user-uuid-1",
 *     "created_at": "2023-01-01T12:00:00Z",
 *     "is_deleted": false
 *   },
 *   // ... more chat entries
 * ]
 * ```
 */
export async function GET(request: Request) {
  log.info('Chat History API: Fetching chat history...');
  try {
    const user = await requireUser(); // Authenticate user and get user object

    const history = await chatService.getChatHistory(user.id);

    log.info(`Chat History API: Successfully fetched history for user ${user.id}`);
    return NextResponse.json(history, { status: 200 });
  } catch (error: any) {
    if (error instanceof ExternalApiError) {
      log.error('Chat History API: Authentication Error');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log.error('Chat History API: Unexpected error');
    return NextResponse.json(
      { error: 'Failed to fetch chat history. Please try again later.' },
      { status: 500 },
    );
  }
}
