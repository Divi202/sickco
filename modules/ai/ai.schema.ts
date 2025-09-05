// modules/ai/v2/ai.schema.ts
import { z } from 'zod';

// SickCo AI Request DTO: what the chat service send to SickCo
export const SickCoAIRequestDTO = z.object({
  //   userId: z.string().uuid(),
  userMessage: z.string().min(1),
});

export type SickCoAIRequestDTO = z.infer<typeof SickCoAIRequestDTO>;

// SickCo AI Response DTO: what SickCo replies with
export const SickCoAIResponseDTO = z.object({
  //   userId: z.string().uuid(),
  id: z.string().uuid(),
  empathy: z.string(),
  information: z.string(),
  disclaimer: z.string(),
  followUpQuestion: z.string(),
});

export type SickCoAIResponseDTO = z.infer<typeof SickCoAIResponseDTO>;
