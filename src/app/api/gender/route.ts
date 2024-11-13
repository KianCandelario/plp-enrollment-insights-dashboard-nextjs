import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');

    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('EnrollmentDashboard')
      .select('gender, course');

    if (college && college !== 'All Colleges') {
      query = query.eq('course', college);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    const genderData = { female: 0, male: 0 };
    allData.forEach((row) => {
      const gender = row.gender?.toLowerCase();
      if (gender === 'female') {
        genderData.female += 1;
      } else if (gender === 'male') {
        genderData.male += 1;
      }
    });

    return NextResponse.json([genderData]);
  } catch (error) {
    console.error('Error fetching gender data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gender data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static';