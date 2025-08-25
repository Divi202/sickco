/**
 * Root Layout Component
 * 
 * This is the root layout component for the Next.js application that wraps all pages.
 * It sets up the basic HTML structure, fonts, and global metadata for the entire application.
 * 
 * Features:
 * - Configures Geist Sans and Geist Mono fonts
 * - Sets up global CSS variables for fonts
 * - Defines application metadata (title, description)
 * - Provides consistent HTML structure across all pages
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} The root HTML structure with fonts and metadata
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Geist Sans font configuration
 * Loads the Geist Sans font family with Latin subset support
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration  
 * Loads the Geist Mono font family for monospace text with Latin subset support
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata configuration
 * Defines the title and description that appear in browser tabs and search results
 */
export const metadata: Metadata = {
  title: "SickCo - Sickness Companion",
  description:
    "Your AI-powered health companion for symptom tracking and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
