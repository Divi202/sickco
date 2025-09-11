import { NextResponse } from 'next/server';
import { log } from '@/lib/log';

// Handle GET requests
export async function GET() {
  try {
    log.info('Test log: GET request received');
    return NextResponse.json({ message: 'GET request successful' });
  } catch (error: any) {
    log.error({ err: error }, 'Error in GET /api/v1/logtest');
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
