// app/api/years-in-pasig/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedCollege = searchParams.get('college');

    const categories = [
      'less than 1 year',
      '1 - 5 years',
      '6 - 10 years',
      '11 - 15 years',
      '16 - 20 years',
      '21 - 25 years',
      '26 years and above'
    ];

    // Initialize batch fetching parameters
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    // Base query
    let query = supabase
      .from('Dashboard')
      .select('yearsInPasig, curricularProgram');

    // Add college filter if specific college is selected
    if (selectedCollege && 
        selectedCollege !== 'All College' && 
        selectedCollege !== 'All Colleges') {
      query = query.eq('curricularProgram', selectedCollege);
    }

    // Fetch data in batches
    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    console.log(`Total records fetched: ${allData.length}`); // Debug log

    // Process the data to get counts for each category
    const categoryCounts = categories.map(category => {
      const count = allData.filter(item => item.yearsInPasig === category).length;
      return {
        category: category,
        count: count
      };
    });

    // Debug log
    console.log('Processed data:', categoryCounts);

    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching years in Pasig data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
}