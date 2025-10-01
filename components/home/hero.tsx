import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import ExampleSuggestions from './ExampleSuggestions';
import LoginPromptModal from './LoginPromptModal';
import { useRouter } from 'next/navigation';
import { ChatRequestDTO } from '@/modules/chat/chat.schema';
import { createClient } from '@/lib/supabase/client';
/**
 * Hero Component
 *
 * Main component for user input of symptoms and interaction with Sickco AI.
 *
 * @returns {JSX.Element} The rendered symptom input interface
 */
export function Hero() {
  // State for user input
  const [userInput, setUserInput] = useState('');
  // Loading state for API calls (now for navigation)
  const [isLoading, setIsLoading] = useState(false);
  // Error state for displaying error messages
  const [error, setError] = useState<string | null>(null);

  // State for login prompt modal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const router = useRouter(); // Initialize useRouter

  /**
   * Handles clicking on example suggestions
   * Populates the textarea with the selected example text
   *
   * @param {string} example - The example text to populate in the input
   */
  const handleExampleClick = (example: string) => {
    setUserInput(example);
  };

  /**
   * Handles form submission and navigation
   *
   * Validates input and navigates to the dashboard with userInput as a query parameter.
   *
   * @async
   * @returns {Promise<void>}
   */

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    // Check if user is authenticated
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // User is not logged in, show login prompt
      setShowLoginPrompt(true);
      setIsLoading(false);
      return;
    }

    // Validate input using Zod schema
    // console.log('Submitting user input:', userInput);
    const validationResult = ChatRequestDTO.safeParse({ userMessage: userInput });

    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      console.error('Validation Error:', validationResult.error);
      return;
    }
    setError(null); // Clear previous errors on successful validation

    try {
      // Redirect to dashboard with userInput as a query parameter
      router.push(`/dashboard?userInput=${encodeURIComponent(userInput.trim())}&section=sickco-ai`);
    } catch (err: any) {
      console.error('Error navigating:', err);
      setError(err.message || 'An unexpected error occurred during navigation.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles closing the login prompt modal
   */
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  /**
   * Handles navigation to login page
   */
  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    router.push('/login');
  };

  /**
   * Handles navigation to signup page
   */
  const handleSignupClick = () => {
    setShowLoginPrompt(false);
    router.push('/signup');
  };

  /**
   * Handles keyboard shortcuts for form submission
   * Allows users to submit using Cmd+Enter or Ctrl+Enter
   *
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <header className="text-center">
        <h1 className="text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Never Feel Lost About Your Health Again.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          With SickCo, you&apos;re never alone. Just chat and get answers to all your health-related
          questions. Simple, supportive, and always here for you.
        </p>
        <div className="mx-auto mt-4 h-1 w-10 rounded-full bg-accent" aria-hidden="true" />
      </header>

      <div className="mx-auto mt-8 w-full max-w-3xl">
        {/* Chat input card */}
        <div className="relative rounded-xl border bg-card p-3 text-card-foreground shadow-sm md:p-4">
          {/* For accessibility, keep a visible placeholder and an sr-only label */}
          <label htmlFor="symptom" className="sr-only">
            Describe your symptom or health condition
          </label>
          <Textarea
            id="symptom"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptom or health condition..."
            className="min-h-28 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!userInput.trim() || isLoading} // The disabled state now relies solely on isLoading
            className="absolute bottom-3 right-3 md:bottom-4 md:right-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoaderCircle className="h-4 w-4"></LoaderCircle>
            ) : (
              <>
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send Message</span>
              </>
            )}
          </Button>
        </div>

        {/* Error  */}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {/* Pass the example click handler */}
        <div className="mt-12">
          <ExampleSuggestions onExampleClick={handleExampleClick} />
        </div>

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={handleCloseLoginPrompt}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />
      </div>
    </section>
  );
}

export default Hero;
