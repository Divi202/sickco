/**
 * Utility Functions
 * 
 * This module provides common utility functions used throughout the application.
 * Currently includes class name merging functionality for Tailwind CSS.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names using clsx and tailwind-merge
 * 
 * This utility function allows for conditional class names and ensures that
 * Tailwind CSS classes are properly merged without conflicts. It's particularly
 * useful when you need to conditionally apply classes or merge component classes
 * with prop-based classes.
 * 
 * @param {...ClassValue[]} inputs - Variable number of class values to merge
 * @returns {string} The merged class name string
 * 
 * @example
 * ```typescript
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * // Returns: "px-4 py-2 bg-blue-500 custom-class"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
