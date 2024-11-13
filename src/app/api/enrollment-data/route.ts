import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    while (true) {
      const { data, error } = await supabase
        .from('EnrollmentDashboard')
        .select('studentID, course')
        .range(start, end);

      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    return NextResponse.json(allData);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
