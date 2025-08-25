// app/api/health/symptoms/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { symptomService } from '@/modules/health/services/symptomService'; // Use the service
import { CreateSymptomEntryDTO } from '@/modules/health/models/SymptomEntry';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { symptoms }: CreateSymptomEntryDTO = await request.json();

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return NextResponse.json(
        { error: 'Symptoms are required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    // Call the symptom service which now handles both DB entry and AI analysis
    const { symptomEntry, aiAnalysis } = await symptomService.createSymptomEntry(supabase, { symptoms });

    // Return both the symptom entry details and the AI analysis
    return NextResponse.json({ symptomEntry, aiAnalysis }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/health/symptoms:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}