import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get('course');

  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('EnrollmentDashboard')
      .select('feederSchoolType, course');

    if (course && course !== 'All Colleges') {
      query = query.eq('course', course);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    const schoolTypeCounts = allData.reduce((acc, row) => {
      const type = row.feederSchoolType.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(schoolTypeCounts).map(([type, count]) => ({
      browser: type,
      students: count,
      fill: type === 'public' ? 'var(--color-public)' : 'var(--color-private)',
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching feeder school data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feeder school data' },
      { status: 500 }
    );
  }
}
