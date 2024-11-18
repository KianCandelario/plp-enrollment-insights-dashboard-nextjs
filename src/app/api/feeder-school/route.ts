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
      .from('Dashboard')
      .select('feederSchool, curricularProgram');

    if (course && course !== 'All Colleges') {
      query = query.eq('curricularProgram', course);
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
      const type = row.feederSchool.toLowerCase(); // Convert to lowercase for consistency
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(schoolTypeCounts).map(([type, count]) => ({
      browser: type === 'public' ? 'Public' : 'Private', // Proper case for display
      students: count,
      fill: type === 'public' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}