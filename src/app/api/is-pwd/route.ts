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
      .select('isPWD, curricularProgram');

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

    const pwdCounts = {
      Yes: 0,
      No: 0
    };

    allData.forEach((row: { isPWD: string }) => {
      const status = row.isPWD || 'No'; // Default to 'No' if undefined
      pwdCounts[status as keyof typeof pwdCounts]++;
    });

    const result = Object.entries(pwdCounts).map(([status, count]) => ({
      status,
      count,
      fill: status === 'Yes' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching PWD data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PWD data' },
      { status: 500 }
    );
  }
}