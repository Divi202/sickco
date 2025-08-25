/**
 * Textarea Component
 * 
 * A styled textarea component that provides consistent styling and behavior
 * across the application. Built with Tailwind CSS and includes proper focus
 * states, validation styling, and accessibility features.
 * 
 * Features:
 * - Consistent styling with design system
 * - Proper focus and validation states
 * - Dark mode support
 * - Accessibility features
 * - Auto-sizing content support
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea Component
 * 
 * A flexible textarea input component with consistent styling and accessibility features.
 * Supports all standard HTML textarea attributes and includes proper validation states.
 * 
 * @param {React.ComponentProps<"textarea">} props - Standard textarea HTML attributes
 * @param {string} [props.className] - Additional CSS classes to merge with default styles
 * @param {React.Ref<HTMLTextAreaElement>} ref - Forwarded ref to the textarea element
 * @returns {JSX.Element} The rendered textarea component
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   placeholder="Enter your message..."
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 *   className="min-h-32"
 * />
 * ```
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
