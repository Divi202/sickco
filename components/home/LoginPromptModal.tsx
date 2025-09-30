'use client';

/**
 * LoginPromptModal Component
 *
 * A modal component that prompts unauthenticated users to log in before
 * they can use the service. Displays when users try to submit data without
 * being logged in.
 *
 * Features:
 * - Smooth animations using Framer Motion
 * - Backdrop overlay to prevent background interaction
 * - Clear call-to-action buttons for login and signup
 * - Responsive design
 * - Accessible modal implementation
 *
 * @component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';

/**
 * Props interface for the LoginPromptModal component
 */
interface LoginPromptModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Callback function when user clicks login button */
  onLoginClick: () => void;
  /** Callback function when user clicks signup button */
  onSignupClick: () => void;
}

/**
 * LoginPromptModal Component
 *
 * Displays a modal prompting users to authenticate before using the service.
 * Includes options to login or signup with smooth animations.
 *
 * @param {LoginPromptModalProps} props - Component properties
 * @returns {JSX.Element} The rendered login prompt modal
 */
export default function LoginPromptModal({
  isOpen,
  onClose,
  onLoginClick,
  onSignupClick,
}: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content - Updated to use theme tokens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Icon - Updated to use theme primary color */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Content - Updated text colors to theme tokens */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-3">Login Required</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To use SickCo's AI-powered health companion, you need to create an account or sign
                  in to your existing account.
                </p>
              </div>

              {/* Action Buttons - Updated button styling to match theme */}
              <div className="space-y-3">
                <Button
                  onClick={onLoginClick}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200"
                >
                  Sign In to Your Account
                </Button>

                <Button
                  onClick={onSignupClick}
                  variant="outline"
                  className="w-full bg-transparent border-border text-foreground hover:bg-muted hover:text-foreground font-medium py-3 transition-all duration-200"
                >
                  Create New Account
                </Button>
              </div>

              {/* Additional Info - Updated border and text colors */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Your health data is secure and private. We never share your information.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
