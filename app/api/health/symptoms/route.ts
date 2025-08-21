// src/app/api/health/symptoms/route.ts

import { NextResponse } from 'next/server';
import { symptomService } from '@/modules/health/services/symptomService';
import { CreateSymptomEntryDTO } from '@/modules/health/models/SymptomEntry';

/**
 * Handles POST requests to create a new symptom entry.
 * This is your API layer, acting as a "controller".
 */
export async function POST(request: Request) {
  try {
    const body: CreateSymptomEntryDTO = await request.json();

    // Use the domain service to handle the business logic
    const newSymptomEntry = await symptomService.createSymptomEntry(body);

    return NextResponse.json(newSymptomEntry, { status: 201 });
  } catch (error: any) {
    console.error('API Error creating symptom entry:', error);
    // Provide a generic error message to the client for security
    return NextResponse.json(
      { message: 'Failed to create symptom entry', error: error.message },
      { status: 500 },
    );
  }
}

/**
 * Handles GET requests to retrieve a symptom entry by ID.
 * Example: GET /api/health/symptoms?id=some-uuid
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    const symptomEntry = await symptomService.getSymptomEntryById(id);

    if (!symptomEntry) {
      return NextResponse.json({ message: 'Symptom entry not found' }, { status: 404 });
    }

    return NextResponse.json(symptomEntry, { status: 200 });
  } catch (error: any) {
    console.error('API Error fetching symptom entry:', error);
    return NextResponse.json(
      { message: 'Failed to fetch symptom entry', error: error.message },
      { status: 500 },
    );
  }
}
