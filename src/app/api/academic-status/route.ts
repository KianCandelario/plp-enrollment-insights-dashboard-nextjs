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
      .select('academicStatus, curricularProgram');

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

    const statusCounts: { [key: string]: number } = {};
    allData.forEach((row: { academicStatus: string }) => {
      const { academicStatus } = row;
      if (academicStatus) {
        statusCounts[academicStatus] = (statusCounts[academicStatus] || 0) + 1;
      }
    });

    const result = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: status === 'Regular' ? 'var(--color-regular)' : 'var(--color-irregular)'
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching academic status data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academic status data' },
      { status: 500 }
    );
  }
}