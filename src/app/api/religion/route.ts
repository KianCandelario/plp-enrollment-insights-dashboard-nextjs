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
      .from('Dashboard')
      .select('religion, curricularProgram');

    if (college && college !== 'All Colleges') {
      query = query.like('curricularProgram', `${college}%`);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    const religionCounts: { [key: string]: number } = {};
    allData.forEach((row: { religion: string }) => {
      const { religion } = row;
      religionCounts[religion] = (religionCounts[religion] || 0) + 1;
    });

    const result = Object.entries(religionCounts)
      .map(([religion, population]) => ({ religion, population }))
      .sort((a, b) => (b.population as number) - (a.population as number));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching religion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch religion data' },
      { status: 500 }
    );
  }
}