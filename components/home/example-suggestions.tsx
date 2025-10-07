/**
 * ExampleSuggestions Component
 *
 * A user interface component that displays clickable example health conditions
 * and symptoms to help users get started with the symptom input process.
 *
 * This component improves user experience by providing common symptom examples
 * that users can click to quickly populate the main input field, reducing
 * friction and providing guidance on the expected input format.
 *
 * Features:
 * - Grid layout of example symptom descriptions
 * - Smooth animations using Framer Motion
 * - Responsive design for different screen sizes
 * - Hover and tap interactions
 * - Customizable example suggestions
 * - Callback integration with parent components
 *
 * @component
 */

'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';

/**
 * Props interface for the ExampleSuggestions component
 *
 * @interface ExampleSuggestionsProps
 */
interface ExampleSuggestionsProps {
  /**
   * Callback function triggered when a user clicks on an example
   * Receives the selected example text as a parameter
   */
  onExampleClick?: (example: string) => void;
}

/**
 * Predefined example symptom descriptions
 *
 * These examples are carefully chosen to represent common health scenarios
 * that users might want to analyze. They provide guidance on the level of
 * detail expected and cover various types of health conditions.
 */
const examples = [
  'I have a cold and sore throat',
  'Recovering from stomach flu',
  'Managing diabetes symptoms',
  'Dealing with migraine headaches',
];

/**
 * ExampleSuggestions Component
 *
 * Renders a grid of clickable example symptom descriptions that users can
 * select to quickly populate the main symptom input field. Each example
 * is presented as an interactive card with smooth animations.
 *
 * @param {ExampleSuggestionsProps} props - Component properties
 * @param {Function} [props.onExampleClick] - Callback for when an example is clicked
 * @returns {JSX.Element} The rendered example suggestions interface
 *
 * @example
 * ```tsx
 * <ExampleSuggestions
 *   onExampleClick={(example) => setSymptoms(example)}
 * />
 * ```
 */
export default function ExampleSuggestions({ onExampleClick }: ExampleSuggestionsProps) {
  return (
    <>
      {/* Try these examples text */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground text-base md:text-lg font-medium">
          Try these examples:
        </p>
      </div>

      {/* Example chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {examples.map((example) => (
          <Button
            key={example}
            onClick={() => onExampleClick?.(example)}
            variant="secondary"
            size="sm"
            className="rounded-full transition-all duration-200"
          >
            {example}
          </Button>
        ))}
      </div>
    </>
  );
}
