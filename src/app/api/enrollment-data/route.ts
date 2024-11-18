// api/enrollment-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const college = searchParams.get('college');

    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    while (true) {
      let query = supabase
        .from('Dashboard')
        .select('email, curricularProgram');

      if (college && college !== 'All Colleges') {
        query = query.like('curricularProgram', `${college}%`);
      }

      const { data, error } = await query.range(start, end);

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