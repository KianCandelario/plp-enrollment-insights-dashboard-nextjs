import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let courseCode = url.searchParams.get('courseCode') || 'GRAND_TOTAL';

    if (courseCode === 'All Colleges') {
      courseCode = 'GRAND_TOTAL';
    }

    const { data, error } = await supabase
      .from('EnrollmentData')
      .select('year, enrollment, isActual, lowerBound, upperBound')
      .eq('courseCode', courseCode)
      .order('year', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}