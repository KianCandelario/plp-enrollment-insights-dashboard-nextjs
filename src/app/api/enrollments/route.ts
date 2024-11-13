import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let courseCode = searchParams.get('courseCode') || 'GRAND_TOTAL';

    if (courseCode === 'All Colleges') {
      courseCode = 'GRAND_TOTAL';
    }

    console.log('Fetching data for courseCode:', courseCode);

    const { data, error } = await supabase
      .from('EnrollmentData')
      .select('year, enrollment, isActual, lowerBound, upperBound')
      .eq('courseCode', courseCode)
      .order('year', { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('No data found for courseCode:', courseCode);
      return NextResponse.json([]);
    }

    console.log(`Found ${data.length} records for courseCode:`, courseCode);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
