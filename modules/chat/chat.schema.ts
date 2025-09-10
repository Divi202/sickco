// modules/chat/schemas/chat.schema.ts
import { z } from 'zod';

// Request DTO: what the frontend sends to SickCo
export const ChatRequestDTO = z.object({
  userMessage: z.string().max(2000),
});

export type ChatRequestDTO = z.infer<typeof ChatRequestDTO>;

// Response DTO: what SickCo replies with
export const ChatResponseDTO = z.object({
  //   userId: z.string().uuid(),
  empathy: z.string().optional(),
  information: z.string(),
  disclaimer: z.string().optional(),
  followUpQuestion: z.string(),
});

export type ChatResponseDTO = z.infer<typeof ChatResponseDTO>;
