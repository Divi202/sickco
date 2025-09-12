import { aiService } from '@/modules/ai/ai.service';
import { ChatRequestDTO, ChatResponseDTO } from './chat.schema';
import { chatRepository } from '../chat/chat.repository';
import { log } from '@/lib/log';
import { AppError, DbError, ExternalApiError } from '@/lib/errors';

/**
 * Chat Service
 *
 * Module service that orchestrates sickco chat realted business operations.
 * This service coordinates between data persistence (via models)
 * and AI response (via AI services) to provide comprehensive reposne of the user input.
 *
 * The service implements the business logic for chat management,
 * including validation, data transformation, and workflow orchestration.
 *
 * Features:
 * - user input entry creation and validation (if needed)
 * - AI response integration
 * - Database transaction coordination
 * - Business rule enforcement
 * - Error handling and logging
 */

/**
 * Chat Service Object
 *
 * Provides high-level operations for chat management with integrated
 * AI response capabilities. Acts as the main business logic coordinator
 * for chat-related operations.
 */

export const chatService = {
  // Function to process save user input input and get AI response
  async processMessage(message: ChatRequestDTO): Promise<ChatResponseDTO | undefined> {
    log.info('Chat Service: Processing user data...'); // info log
    log.debug('User data: ', message);

    // business validation logic here (if needed)
    // e.g., check for prohibited content, length limits, etc.

    // Save user input message to database
    try {
      /* NOTE:  new entrry conatins message form the databse that entry is 
     created but we are not using it for now
     */
      const newEntry = await chatRepository.create(message);
      if (!newEntry) {
        throw new DbError('Database fails to create new entry');
      }
      //Request AI analysis (non-blocking - entry is preserved even if this fails)
      const aiResponse = await aiService.sickcoAI({
        userMessage: message.userMessage,
      });

      if (!aiResponse) {
        throw new ExternalApiError('No reponse returend from the LLM.');
      }

      log.info('Chat Service: Successully saved the user input and produce AI response.'); // info log

      return {
        empathy: aiResponse.empathy,
        information: aiResponse.information,
        disclaimer: aiResponse.disclaimer,
        followUpQuestion: aiResponse.followUpQuestion,
      };
    } catch (error) {
      throw error;
    }
  },
};
