// app/api/v1/chat/clear/route.ts
import { NextResponse } from 'next/server';
import { log } from '@/lib/log';
import { requireUser } from '@/lib/auth';
import { chatService } from '@/modules/chat/chat.service';
import { ExternalApiError } from '@/lib/errors';

/**
 * Clear Chat History API Route
 *
 * Next.js API route handler for clearing a user's chat history.
 * This endpoint performs a soft delete on all chat entries for the authenticated user.
 *
 * @route POST /api/v1/chat/clear
 *
 * --------------------------------------------------------------------------
 * POST Handler for clearing chat history
 *
 * Authenticates the user and marks all their chat messages as deleted.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response indicating success or failure.
 *
 * @example
 * Request body: (empty)
 * ```json
 * {}
 * ```
 *
 * Response (success):
 * ```json
 * {
 *   "message": "Chat history cleared successfully"
 * }
 * ```
 */
export async function POST(request: Request) {
  log.info('Clear Chat History API: Clearing chat history...');
  try {
    const user = await requireUser(); // Authenticate user and get user object

    await chatService.clearUserChatHistory(user.id);

    log.info(`Clear Chat History API: Successfully cleared history for user ${user.id}`);
    return NextResponse.json({ message: 'Chat history cleared successfully' }, { status: 200 });
  } catch (error: any) {
    if (error instanceof ExternalApiError) {
      log.error('Clear Chat History API: Authentication Error');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log.error('Clear Chat History API: Unexpected error');
    return NextResponse.json(
      { error: 'Failed to clear chat history. Please try again later.' },
      { status: 500 },
    );
  }
}
