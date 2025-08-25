/**
 * Health Symptoms API Route
 * 
 * Next.js API route handler for processing health symptom submissions.
 * This endpoint receives symptom descriptions from the frontend, processes
 * them through the health service layer, and returns AI analysis results.
 * 
 * Features:
 * - Input validation and sanitization
 * - Integration with health and AI services
 * - Proper error handling and HTTP status codes
 * - Structured JSON responses
 * - Database integration via Supabase
 * 
 * @route POST /api/health/symptoms
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { symptomService } from '@/modules/health/services/symptomService';
import { CreateSymptomEntryDTO } from '@/modules/health/models/SymptomEntry';

/**
 * POST Handler for Symptom Submission
 * 
 * Processes incoming symptom descriptions and returns AI-powered health analysis.
 * The handler validates input, creates database entries, and coordinates with
 * AI services to provide comprehensive health insights.
 * 
 * @param {Request} request - The incoming HTTP request containing symptom data
 * @returns {Promise<NextResponse>} JSON response with symptom entry and AI analysis
 * 
 * @example
 * Request body:
 * ```json
 * {
 *   "symptoms": "I have been experiencing headaches and fatigue for the past few days"
 * }
 * ```
 * 
 * Response:
 * ```json
 * {
 *   "symptomEntry": {
 *     "id": "uuid",
 *     "symptoms": "...",
 *     "createdAt": "2024-01-01T00:00:00Z"
 *   },
 *   "aiAnalysis": {
 *     "id": "ai-analysis-123",
 *     "analysis": "Based on your symptoms...",
 *     "confidence": 0.85,
 *     "recommendations": ["Get rest", "Stay hydrated"],
 *     "urgencyLevel": "low",
 *     "createdAt": "2024-01-01T00:00:00Z"
 *   }
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    // Initialize Supabase client for database operations
    const supabase = await createClient();
    
    // Parse and validate request body
    const { symptoms }: CreateSymptomEntryDTO = await request.json();

    // Input validation
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return NextResponse.json(
        { error: 'Symptoms are required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // Process symptoms through the service layer (handles DB + AI)
    const { symptomEntry, aiAnalysis } = await symptomService.createSymptomEntry(supabase, { symptoms });

    // Return both the symptom entry details and the AI analysis
    return NextResponse.json({ symptomEntry, aiAnalysis }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/health/symptoms:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}