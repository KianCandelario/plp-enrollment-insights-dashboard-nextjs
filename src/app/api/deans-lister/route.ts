// Dean's Lister API
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const college = url.searchParams.get('college');

    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('Dashboard')
      .select('curricularProgram, deansLister');

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

    const statusCounts = {
      'Yes': 0,
      'No': 0
    };

    allData.forEach((student: { deansLister: string }) => {
      const { deansLister } = student;
      if (deansLister === 'Yes' || deansLister === 'No') {
        statusCounts[deansLister]++;
      }
    });

    const total = statusCounts['Yes'] + statusCounts['No'];
    const percentage = (statusCounts['Yes'] / total) * 100;

    const chartData = [
      {
        name: "Dean's Lister",
        value: percentage,
        count: statusCounts['Yes'],
        total: total,
        fill: "hsl(var(--chart-1))"
      }
    ];

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching deans lister data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}