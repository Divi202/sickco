// modules/ai/utils/promptReader.ts
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads the AI system prompt from a Markdown file.
 * This function is designed to be used on the server-side (e.g., Next.js API routes).
 *
 * @returns {Promise<string>} The content of the system prompt Markdown file.
 * @throws {Error} If the prompt file cannot be read.
 */
export async function getSystemPrompt(): Promise<string> {
  // Construct the absolute path to the system_prompt.md file.
  // process.cwd() gives the current working directory (project root in Next.js).
  const promptFilePath = path.join(process.cwd(), 'modules', 'ai', 'prompts', 'systemPrompt.md');

  try {
    const promptContent = await fs.readFile(promptFilePath, 'utf8');
    return promptContent;
  } catch (error) {
    console.error('Error reading system prompt file:', error);
    throw new Error(
      'Failed to load AI system prompt. Please ensure modules/ai/prompts/systemPrompt.md exists and is accessible.',
    );
  }
}
