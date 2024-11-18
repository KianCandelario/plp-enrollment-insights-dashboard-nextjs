import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const curricularProgram = searchParams.get('college');

    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('Dashboard')
      .select('sex');

    if (curricularProgram && curricularProgram !== 'All Colleges') {
      query = query.eq('curricularProgram', curricularProgram);
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
      const sex = row.sex?.toLowerCase();
      if (sex === 'female') {
        genderData.female += 1;
      } else if (sex === 'male') {
        genderData.male += 1;
      }
    });

    // Convert to array format with single object
    return NextResponse.json([genderData]);
  } catch (error) {
    console.error('Error fetching gender distribution data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gender distribution data' },
      { status: 500 }
    );
  }
}