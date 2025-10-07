'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/theme-toggle';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="SickCo Home">
          <span className="text-lg font-semibold leading-none">
            <span className="text-foreground">Sick</span>
            <span className="text-primary">Co</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile: hamburger menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" aria-label="Open menu">
                  <Menu className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href="/login" aria-label="Go to Login">
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup" aria-label="Create Account">
                    Create Account
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop/tablet: auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
