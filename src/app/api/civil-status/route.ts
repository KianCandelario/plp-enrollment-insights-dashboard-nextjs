// app/api/civil-status/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface CivilStatusCount {
  civil_status: string;
  population: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const college = searchParams.get('college');

  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let hasMore = true;

    // Base query
    let query = supabase
      .from('Dashboard')
      .select('civilStatus')
      .filter('civilStatus', 'not.eq', null);

    // Add college filter if specified
    if (college && college !== 'All Colleges') {
      query = query.ilike('curricularProgram', `${college}%`);
    }

    // Fetch data in batches
    while (hasMore) {
      const { data, error } = await query.range(start, start + batchSize - 1);
      
      if (error) throw error;
      if (!data || data.length === 0) break;
      
      allData = allData.concat(data);
      hasMore = data.length === batchSize;
      start += batchSize;
    }

    // Process data
    const formattedData = allData.reduce((acc: CivilStatusCount[], row: { civilStatus: string }) => {
      const existingStatus = acc.find((item) => item.civil_status === row.civilStatus);
      if (existingStatus) {
        existingStatus.population += 1;
      } else {
        acc.push({ civil_status: row.civilStatus, population: 1 });
      }
      return acc;
    }, []);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching civil status data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}