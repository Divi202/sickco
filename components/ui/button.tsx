/**
 * Button Component
 * 
 * A flexible, accessible button component built with Radix UI and styled with Tailwind CSS.
 * Supports multiple variants, sizes, and can render as different HTML elements using the asChild prop.
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (default, sm, lg, icon)
 * - Accessibility features with proper focus states
 * - Can render as child element using Radix Slot
 * - Full TypeScript support with proper prop types
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant styles using class-variance-authority
 * 
 * Defines the different visual styles and sizes available for the button component.
 * Uses Tailwind CSS classes for styling and supports dark mode variants.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component Props
 * 
 * Extends standard HTML button props with additional variant and size options.
 * Supports the asChild prop for rendering as a different element.
 */
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** 
   * When true, the button will render as its child element instead of a button.
   * Useful for creating button-styled links or other interactive elements.
   */
  asChild?: boolean;
}

/**
 * Button Component
 * 
 * A versatile button component that supports multiple visual variants and sizes.
 * Can be rendered as different HTML elements using the asChild prop.
 * 
 * @param {ButtonProps} props - The button component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'} [props.variant='default'] - Visual variant
 * @param {'default'|'sm'|'lg'|'icon'} [props.size='default'] - Size variant
 * @param {boolean} [props.asChild=false] - Whether to render as child element
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the button element
 * @returns {JSX.Element} The rendered button component
 * 
 * @example
 * ```tsx
 * <Button variant="default" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false, 
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
