// app/api/working-student/route.ts
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
      .select('workingStudent, curricularProgram');

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

    // Process the data
    const workingStudentCounts: { [key: string]: number } = {};
    allData.forEach((row: { workingStudent: string }) => {
      const { workingStudent } = row;
      if (workingStudent) { // Check if workingStudent is not null/undefined
        workingStudentCounts[workingStudent] = (workingStudentCounts[workingStudent] || 0) + 1;
      }
    });

    // Format data for the pie chart
    const chartData = [
      { 
        status: 'Yes',
        count: workingStudentCounts['Yes'] || 0,
        fill: "hsl(var(--chart-1))"
      },
      {
        status: 'No',
        count: workingStudentCounts['No'] || 0,
        fill: "hsl(var(--chart-2))"
      }
    ];

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching working student data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch working student data' },
      { status: 500 }
    );
  }
}