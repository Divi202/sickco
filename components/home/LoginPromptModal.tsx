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
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Login Required
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  To use SickCo's AI-powered health companion, you need to create an account or sign in to your existing account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onLoginClick}
                  className="w-full bg-green-600/90 hover:bg-green-600 text-white font-medium py-3 transition-all duration-200"
                >
                  Sign In to Your Account
                </Button>
                
                <Button
                  onClick={onSignupClick}
                  variant="outline"
                  className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:text-white font-medium py-3 transition-all duration-200"
                >
                  Create New Account
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 text-center">
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