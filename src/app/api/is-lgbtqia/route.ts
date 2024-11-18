// app/api/lgbtqia/route.ts
import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

type LGBTQIAResponse = 'Yes' | 'No';
type LGBTQIACounts = Record<LGBTQIAResponse, number>;

interface DashboardRow {
  isLGBTQIA: LGBTQIAResponse;
  curricularProgram: string;
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');

    const batchSize = 1000;
    let allData: DashboardRow[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('Dashboard')
      .select('isLGBTQIA, curricularProgram');

    if (college && college !== 'All Colleges') {
      query = query.like('curricularProgram', `${college}%`);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data as DashboardRow[]);
      start += batchSize;
      end += batchSize;
    }

    const lgbtqiaCounts: LGBTQIACounts = {
      'Yes': 0,
      'No': 0
    };

    allData.forEach((row) => {
      if (row.isLGBTQIA === 'Yes' || row.isLGBTQIA === 'No') {
        lgbtqiaCounts[row.isLGBTQIA]++;
      }
    });

    const result = Object.entries(lgbtqiaCounts).map(([response, count]) => ({
      category: response,
      value: count,
      fill: response === 'Yes' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching LGBTQIA data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LGBTQIA data' },
      { status: 500 }
    );
  }
}