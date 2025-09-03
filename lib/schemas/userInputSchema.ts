// lib/schemas/userInputSchema.ts
import { z } from 'zod';

/**
 * Zod schema for user input
 *
 * Defines the expected structure and validation rules for user input data.
 * This schema is suitable for validating the user's input data.
 */
export const UserInputSchema = z.object({
  userInput: z
    .string()
    .min(5, 'Please provide a more detailed description of your symptoms (minimum 5 characters).')
    .max(2000, 'Symptom description is too long (maximum 2000 characters).')
    .trim(), // Removes whitespace from both ends
});

/**
 * Inferred TypeScript type for UserInput
 * This type is derived from the UserInputSchema and can be used
 * throughout the application to ensure type safety.
 */
export type UserInput = z.infer<typeof UserInputSchema>;
