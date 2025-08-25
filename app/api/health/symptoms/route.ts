// app/api/health/symptoms/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Adjust path if necessary
import { symptomRepository } from '@/modules/health/repositorys/symptomRepository';
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

    const newEntry = await symptomRepository.create(supabase, { symptoms });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/health/symptoms:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
