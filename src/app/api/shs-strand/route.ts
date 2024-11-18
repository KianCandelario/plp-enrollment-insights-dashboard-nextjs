import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

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
      .select('strandInSHS, curricularProgram');

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

    const strandCounts: { [key: string]: number } = {};
    allData.forEach((row: { strandInSHS: string }) => {
      const { strandInSHS } = row;
      if (strandInSHS) { // Only count non-null/non-empty values
        strandCounts[strandInSHS] = (strandCounts[strandInSHS] || 0) + 1;
      }
    });

    const result = Object.entries(strandCounts)
      .map(([strand, count]) => ({ strand, count }))
      .sort((a, b) => (b.count as number) - (a.count as number));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching strand data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strand data' },
      { status: 500 }
    );
  }
}